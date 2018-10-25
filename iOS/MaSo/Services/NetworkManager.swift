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

    // TODO: - group request parameters in router, Moya
    func submitRequest(teamId: Int,  problemId: Int, action: String, success: (() -> Void)?, failure: ((String) -> Void)?) {
        if let pwd = password, let url = endpointUrl {
            let paramaters: Parameters = [
                "action": action,
                "team": teamId,
                "problem": problemId,
                "password": pwd
            ]
            
            Alamofire.request(url, method: .put, parameters: paramaters, encoding: JSONEncoding.default, headers: nil)
                .validate()
                .responseJSON { response in
                    
                // todp: switch
                switch response.result {
                case .success:
                    print("The code was sent")
                    success?()
                    
                case .failure(let error):
                    
                    guard let data = response.data else {
                        // Data == nil, handle general error
                        failure?(error.localizedDescription)
                        return
                    }
                    
                    do {
                        let errorJson = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any]
                        let errorMsg = errorJson?["message"] as? String ?? "Neznama chyba"
                        failure?(errorMsg)
                    } catch {
                        failure?("Neznama chyba")
                    }
                }
            }
        }
    }
}


// Router - moya, which you will pass to submitRequest
//
