//
//  QR.swift
//  MaSo
//
//  Created by Nikita Beresnev on 10/16/18.
//  Copyright © 2018 Nikita Beresnev. All rights reserved.
//

import Foundation
import RealmSwift

class QR: Object {
    @objc dynamic var teamId: Int = 0
    @objc dynamic var problemId: Int = 0
    @objc dynamic var isSubmited = false


    static func create(teamId: Int, problemId: Int) -> QR {
        let obj = QR()
        obj.teamId = teamId
        obj.problemId = problemId
        
        return obj
    }
    
    
}

