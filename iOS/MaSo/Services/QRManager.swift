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
    
    private func parseCode(qr code: String) -> QR? {
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
    
    func process(with qr: String) {
        if let parsedCode = parseCode(qr: qr) {
            if DatabaseManager.shared.checkIfExists(code: parsedCode) {
                if !DatabaseManager.shared.isSubmitted(code: parsedCode) {
                    NetworkManager.shared.submitRequest(teamId: parsedCode.teamId, problemId: parsedCode.problemId, action: "add")
                    DatabaseManager.shared.markAsSubmitted(code: parsedCode)
                }
            } else {
                DatabaseManager.shared.save(qr: parsedCode)
                NetworkManager.shared.submitRequest(teamId: parsedCode.teamId, problemId: parsedCode.problemId, action: "add")
                DatabaseManager.shared.markAsSubmitted(code: parsedCode)
            }
        } else {
            print("Invalid format")
        }
    }
    
}
