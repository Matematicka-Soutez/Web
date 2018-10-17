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
    var password: String?
    let endpointUrl = URL(string: "https://maso-staging.herokuapp.com/api/competitions/current/team-solutions")

    func submitRequest (teamId: Int,  problemId: Int, action: String) {
        if let pwd = password, let url = endpointUrl {
            let paramaters: Parameters = [
                "action": action,
                "team": teamId,
                "problem": problemId,
                "password": pwd
            ]
            
            Alamofire.request(url, method: .put, parameters: paramaters, encoding: URLEncoding.default, headers: nil).responseData { response in
                if response.result.isSuccess {
                    print("The code was sent")
                } else {
                    print(response.error)
                }
            }
        }
    }
}

