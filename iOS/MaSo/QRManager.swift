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
    
    func parseCode(qr code: String) -> (Int?, Int?) {
        var qr = code
        
        if qr.starts(with: "T") && qr.contains("P") {
            qr.removeFirst()
            let temp = qr.split(separator: "P")
            return (Int(temp[0]), Int(temp[1]))
        } else {
            return (nil, nil)
        }
    }
}
