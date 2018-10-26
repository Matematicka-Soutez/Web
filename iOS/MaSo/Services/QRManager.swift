//
//  QRManager.swift
//  MaSo
//
//  Created by Nikita Beresnev on 10/15/18.
//  Copyright © 2018 Nikita Beresnev. All rights reserved.
//

import Foundation
import AVFoundation

class QRManager {
    static let shared = QRManager()
    var action = Action.add
    
    func parseCode(qr code: String) -> QR? {
        var qr = code
        
        if qr.starts(with: "T") && qr.contains("P") {
            qr.removeFirst()
            let temp = qr.split(separator: "P")
            if let teamId = Int(temp[0]), let problemId = Int(temp[1]) {
                return QR.create(teamId: teamId, problemId: problemId)
            } else {
                return nil
            }
        } else {
            return nil
        }
    }
    
    private func parseCode(teamId: String, problemId: String) -> QR? {
        if let team = Int(teamId), let problem = Int(problemId) {
            return QR.create(teamId: team, problemId: problem)
        } else {
            return nil
        }
    }
    
    func process(with qr: String, completion: @escaping (String) -> Void) {
        if let code = parseCode(qr: qr) {
            executeAction(parsedCode: code) { (message) in
                completion(message)
            }
        }
    }
    
    func process(with teamdId: String, and problemId: String, completion: @escaping (String) -> Void) {
        if let code = parseCode(teamId: teamdId, problemId: problemId) {
            executeAction(parsedCode: code) { (message) in
                completion(message)
            }
        }
    }
    
    private func executeAction(parsedCode: QR, completion: @escaping (String) -> Void) {
            switch action {
            case .add:
                if (!DatabaseManager.shared.checkIfExists(code: parsedCode)) ||
                    (!DatabaseManager.shared.isSubmitted(code: parsedCode)){
                    NetworkManager.shared.submitRequest(teamId: parsedCode.teamId, problemId: parsedCode.problemId, action: action.rawValue, success: {
                        DatabaseManager.shared.save(qr: parsedCode)
                        DatabaseManager.shared.markAsSubmitted(code: parsedCode)
                        completion("Success")
                    }) { (errorMessage) in
                        DatabaseManager.shared.save(qr: parsedCode)
                        completion(errorMessage)
                    }
                }
                
            case .cancel:
                if DatabaseManager.shared.checkIfExists(code: parsedCode) && DatabaseManager.shared.isSubmitted(code: parsedCode) {
                    NetworkManager.shared.submitRequest(teamId: parsedCode.teamId, problemId: parsedCode.problemId, action: action.rawValue, success: {
                        DatabaseManager.shared.remove(code: parsedCode)
                        completion("The code was removed")
                    }) { (errorMessage) in
                        completion(errorMessage)
                }
            }
        }
    }
}
