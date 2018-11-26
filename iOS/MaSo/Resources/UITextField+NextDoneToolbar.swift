//
//  UITextField+NextDoneToolbar.swift
//  MaSo
//
//  Created by Nikita Beresnev on 10/25/18.
//  Copyright © 2018 Nikita Beresnev. All rights reserved.
//

import UIKit

extension UITextField {
    func addDoneToolbar(onDone: (target: Any, action: Selector)? = nil) {
        let onDone = onDone ?? (target: self, action: #selector(doneButtonTapped))
        
        let toolbar: UIToolbar = UIToolbar()
        toolbar.barStyle = .default
        toolbar.items = [
            UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: self, action: nil),
            UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: self, action: nil),
            UIBarButtonItem(title: "Done", style: .done, target: onDone.target, action: onDone.action)
        ]
        toolbar.sizeToFit()
        
        self.inputAccessoryView = toolbar
    }
    
    func addNextToolbar(onNext: (target: Any, action: Selector)? = nil) {
        let onNext = onNext ?? (target: self, action: #selector(nextButtonTapped))
        
        let toolbar: UIToolbar = UIToolbar()
        toolbar.barStyle = .default
        toolbar.items = [
            UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: self, action: nil),
            UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: self, action: nil),
            UIBarButtonItem(title: "Next", style: .plain, target: onNext.target, action: onNext.action)
        ]
        toolbar.sizeToFit()
        
        self.inputAccessoryView = toolbar
    }
    
    // Default actions:
    @objc func nextButtonTapped() { self.resignFirstResponder() }
    @objc func doneButtonTapped() { self.resignFirstResponder() }
}
