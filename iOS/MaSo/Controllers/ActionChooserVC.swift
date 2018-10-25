//
//  ActionChooserVC.swift
//  MaSo
//
//  Created by Nikita Beresnev on 10/19/18.
//  Copyright © 2018 Nikita Beresnev. All rights reserved.
//

import UIKit

class ActionChooserVC: UIViewController {
    @IBOutlet weak var addButton: UIButton!
    @IBOutlet weak var removeButton: UIButton!
    @IBOutlet weak var teamTextField: UITextField!
    @IBOutlet weak var problemTextField: UITextField!
    @IBOutlet weak var toastNotification: Toast!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        view.backgroundColor = Colors.mainYellow
        addButton.layer.cornerRadius = 5
        removeButton.layer.cornerRadius = 5
    }
    


    @IBAction func addButtonPressed(_ sender: UIButton) {
        QRManager.shared.action = Action.add
        if let teamId = teamTextField.text, let problemId = problemTextField.text {
            if teamId.isEmpty || problemId.isEmpty {
                openScannerVC()
            } else {
                QRManager.shared.process(with: teamId, and: problemId) { [weak self](result) in
                    self?.toastNotification.displayToast(message: result)
                }
            }
        }
    }
    
    @IBAction func removeButtonPressed(_ sender: UIButton) {
        QRManager.shared.action = Action.cancel
        openScannerVC()
    }
    
    @IBAction func changePasswordButtonPressed(_ sender: UIButton) {
        self.dismiss(animated: true, completion: nil)
    }
    
    private func openScannerVC() {
        guard let scannerVC = UIStoryboard(name: "QRScannerVC", bundle: nil).instantiateInitialViewController() as? QRScannerVC else {
            assertionFailure("Couldn't find QRScannerVC storyboard")
            return
        }
        
        self.present(scannerVC, animated: true, completion: nil)
    }
}
