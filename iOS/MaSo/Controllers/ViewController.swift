//
//  ViewController.swift
//  MaSo
//
//  Created by Nikita Beresnev on 10/12/18.
//  Copyright © 2018 Nikita Beresnev. All rights reserved.
//

import UIKit


class ViewController: UIViewController, UITextFieldDelegate {
    @IBOutlet var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.dataSource = self
        tableView.reloadData()
        tableView.separatorStyle = .none
        tableView.allowsSelection = false
        tableView.estimatedRowHeight = 288
        tableView.rowHeight = UITableView.automaticDimension
        tableView.register(UINib(nibName: "LogoCellItem", bundle: nil), forCellReuseIdentifier: "logoCell")
        tableView.register(UINib(nibName: "PasswordCellItem", bundle: nil), forCellReuseIdentifier: "passwordCell")
        tableView.backgroundColor = Colors.mainYellow
        
        // Do any additional setup after loading the view, typically from a nib.
        
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide), name: UIResponder.keyboardWillHideNotification, object: nil)
    }
    
    // MARK: - Keyboard observers
    @objc
    func keyboardWillShow(sender: NSNotification) {
        if let keyboardSize = sender.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect {
            var keyboardHeight = keyboardSize.height
            if let tabbar = tabBarController?.tabBar, !tabbar.isHidden {
                keyboardHeight -= tabbar.frame.height
            } else {
                if #available(iOS 11.0, *) {
                    if UIScreen.main.bounds.height > 2436 {
                        keyboardHeight -= view.safeAreaInsets.bottom
                    }
                }
            }
            
            tableView.contentInset = UIEdgeInsets(top: tableView.contentInset.top, left: 0, bottom: keyboardHeight, right: 0)
            tableView.scrollIndicatorInsets = UIEdgeInsets(top: 0, left: 0, bottom: keyboardHeight, right: 0)
        }
    }
    
    @objc
    func keyboardWillHide(sender: NSNotification) {
        tableView.contentInset = UIEdgeInsets(top: tableView.contentInset.top, left: 0, bottom: 0, right: 0)
        tableView.scrollIndicatorInsets = .zero
    }
    
}

extension ViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 2
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        switch (indexPath.row) {
        case 0:
            guard let logoCell = self.tableView.dequeueReusableCell(withIdentifier: "logoCell") as? LogoCellItem else {
                return UITableViewCell()
            }
            logoCell.awakeFromNib()
            return logoCell
            
        case 1:
            guard let passwordCell = self.tableView.dequeueReusableCell(withIdentifier: "passwordCell") as? PasswordCellItem else {
                return UITableViewCell()
            }
            
            passwordCell.textFieldHandler = { [weak self] text in
                guard let actionChooserVC = UIStoryboard(name: "ActionChooserVC", bundle: nil).instantiateInitialViewController() as? ActionChooserVC else {
                    assertionFailure("Storyboard ActionChooserVC couldn't be found")
                    return
                }
                
                NetworkManager.shared.password = passwordCell.passwordTextField.text
                self?.present(actionChooserVC, animated: true, completion: nil)
            }
            
            passwordCell.awakeFromNib()
            return passwordCell
            
        default:
            return UITableViewCell()
        }
    }
}

