//
//  PasswordCellItem.swift
//  MaSo
//
//  Created by Nikita Beresnev on 10/15/18.
//  Copyright © 2018 Nikita Beresnev. All rights reserved.
//

import UIKit

class PasswordCellItem: UITableViewCell, UITextFieldDelegate {
    @IBOutlet weak var passwordTextField: UITextField!
    
    var textFieldHandler: ((String) -> Void)? = nil
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.contentView.backgroundColor = Colors.mainYellow
        passwordTextField.delegate = self
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        if let text = textField.text {
            textFieldHandler?(text)
        }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return true
    }
}
