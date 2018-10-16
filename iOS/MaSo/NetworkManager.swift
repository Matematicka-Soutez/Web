//
//  NetworkManager.swift
//  MaSo
//
//  Created by Nikita Beresnev on 10/12/18.
//  Copyright © 2018 Nikita Beresnev. All rights reserved.
//

import Foundation
import Alamofire

class NetworkManager {
    static let shared = NetworkManager()
//    let baseUrl = URL("https://maso23.herokuapp.com/api/competitions/current/problems")
//
    func signAssignment(for code: String, with token: String) {
        let qr = QRManager.shared.parseCode(qr: code)
        if let teamId = qr.0, let problemId = qr.1 {
            let parameters: Parameters = [
                "team": teamId,
                "problem": problemId,
                "password": token
            ]
            
            Alamofire.request("https://maso23.herokuapp.com/api/competitions/current/problems", method: .post, parameters: parameters).response { response in
                if response.response?.statusCode == 401 {
                    print("Looks like password was incorrect")
                } else {
                    print("Password is correct")
                }
                
            }
        }
    }
}

