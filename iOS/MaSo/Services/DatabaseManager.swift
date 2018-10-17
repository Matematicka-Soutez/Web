//
//  DatabaseManager.swift
//  MaSo
//
//  Created by Nikita Beresnev on 10/16/18.
//  Copyright © 2018 Nikita Beresnev. All rights reserved.
//

import Foundation
import RealmSwift

class DatabaseManager {
    static let shared = DatabaseManager()
    
    let realm = try! Realm()

    
    private func query(for code: QR) -> Results<QR> {
        return realm.objects(QR.self).filter("teamId == %@ && problemId == %@", code.teamId, code.problemId)
    }
    
    func save(qr: QR) {
        try! realm.write {
            realm.add(qr)
        }
    }
    
    func checkIfExists(code: QR) -> Bool {
        let result = query(for: code)
        
        if result.count > 0 {
            return true
        } else {
            return false
        }
    }
    
    func markAsSubmitted(code: QR) {
        let result = query(for: code)
        
        try! realm.write {
            result.first?.isSubmited = true
        }
    }
    
    func isSubmitted (code: QR) -> Bool {
        let result = query(for: code)
        
        return result.first?.isSubmited ?? false
    }
}
