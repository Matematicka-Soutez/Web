//
//  LogoCellItem.swift
//  MaSo
//
//  Created by Nikita Beresnev on 10/15/18.
//  Copyright © 2018 Nikita Beresnev. All rights reserved.
//

import UIKit

class LogoCellItem: UITableViewCell {
    @IBOutlet weak var logoImage: UIImageView!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        
        self.contentView.backgroundColor = Colors.mainYellow
        logoImage.image = UIImage(named: "maso_logo")
        
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
