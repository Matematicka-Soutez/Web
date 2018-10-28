//
//  QRScannerVC.swift
//  MaSo
//
//  Created by Nikita Beresnev on 10/12/18.
//  Copyright © 2018 Nikita Beresnev. All rights reserved.
//

import AVFoundation
import UIKit

class QRScannerVC: UIViewController {
    //MARK: Properties
    var captureSession = AVCaptureSession()
    var videoPreviewLayer: AVCaptureVideoPreviewLayer?
    var qrCodeFrameView: UIView?
    @IBOutlet weak var cancelButton: UIButton!
    @IBOutlet weak var toastNotification: Toast!
    @IBOutlet weak var scannerMenuView: UIView!
    @IBOutlet weak var scannerMenuHeight: NSLayoutConstraint!
    @IBOutlet weak var scannerMenuBottom: NSLayoutConstraint!
    @IBOutlet weak var actionChooser: UISegmentedControl!
    @IBOutlet weak var teamTextField: UITextField! {
        didSet {
            teamTextField?.addNextToolbar(onNext: (target: self, action: #selector(nextButtonTappedFromNumericKeyboard)))
        }
    }
    @IBOutlet weak var problemTextField: UITextField! {
        didSet {
            problemTextField?.addDoneToolbar(onDone: (target: self, action: #selector(doneButtonTappedFromNumericKeyboard)))
        }
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        registerForKeyboardNotifications()
        
        let captureDevice: AVCaptureDevice?
        
        #if targetEnvironment(simulator)
        #else
        if #available(iOS 10.0, *) {
            let deviceDiscoverySession = AVCaptureDevice.DiscoverySession(deviceTypes: [.builtInWideAngleCamera], mediaType: AVMediaType.video, position: .back)
            captureDevice = deviceDiscoverySession.devices.first
        } else {
            captureDevice = AVCaptureDevice.default(for: AVMediaType.video)
        }
        
        
        do {
            guard let captureDevice = captureDevice else {
                assertionFailure("Couldn't connect to camera")
                return
            }

            let input = try AVCaptureDeviceInput(device: captureDevice)
            captureSession.addInput(input)
            
        } catch {
            print(error)
            return
        }

        let captureMetadataOutput = AVCaptureMetadataOutput()
        captureSession.addOutput(captureMetadataOutput)
        captureMetadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
        captureMetadataOutput.metadataObjectTypes = [AVMetadataObject.ObjectType.qr]
        
        videoPreviewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        videoPreviewLayer?.videoGravity = AVLayerVideoGravity.resizeAspectFill
        videoPreviewLayer?.frame = view.layer.bounds
        guard let previewLayer = videoPreviewLayer else {
            assertionFailure("Couldn't inititiate videoPreviewLayer")
            return
        }
        view.layer.addSublayer(previewLayer)
        
        captureSession.startRunning()
        #endif
        
        qrCodeFrameView = UIView()
        if let qrCodeFrameView = qrCodeFrameView {
            qrCodeFrameView.layer.borderColor = UIColor.green.cgColor
            qrCodeFrameView.layer.borderWidth = 2
            view.addSubview(qrCodeFrameView)
            view.bringSubviewToFront(qrCodeFrameView)
        }
        
        setupView()
        
    }
    
    
    //MARK: UI setup method
    private func setupView() {
        cancelButton.layer.cornerRadius = 20
        cancelButton.backgroundColor = UIColor.white
        scannerMenuView.layer.cornerRadius = 20
        scannerMenuView.backgroundColor = Colors.mainYellow
        actionChooser.tintColor = Colors.tintBrownColor
        teamTextField.tintColor = Colors.tintBrownColor
        problemTextField.tintColor = Colors.tintBrownColor
        view.bringSubviewToFront(cancelButton)
        view.bringSubviewToFront(toastNotification)
        view.bringSubviewToFront(scannerMenuView)
        toastNotification.contentView.frame = CGRect(x: 0, y: 0, width: self.view.frame.width, height: toastNotification.frame.height)
        toastNotification.layoutIfNeeded()
    }
    
    //MARK: Keyboard Handling Methods
    private func registerForKeyboardNotifications() {
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(keyboardWillShow),
                                               name: UIResponder.keyboardWillShowNotification,
                                               object: nil)
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(keyboardWillHide),
                                               name: UIResponder.keyboardWillHideNotification,
                                               object: nil)
        
    }
    
    @objc func keyboardWillShow(notification: NSNotification) {
        adjustHeight(showing: true, notification: notification)
    }
    
    @objc func keyboardWillHide(notification: NSNotification) {
        adjustHeight(showing: false, notification: notification)
    }
    
    private func adjustHeight(showing: Bool, notification: NSNotification) {
        guard let keyboardSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue else { return }
        guard let animationDuration = notification.userInfo?[UIResponder.keyboardAnimationDurationUserInfoKey] as? TimeInterval else { return }
        guard let curve = notification.userInfo?[UIResponder.keyboardAnimationCurveUserInfoKey] as? UInt else { return }
        
        let changeInHeight = showing ? (keyboardSize.height - 15) : -15
        
        self.view.layoutIfNeeded()
//        self.scannerMenuHeight.constant += changeInHeight
        self.scannerMenuBottom.constant = changeInHeight
        UIView.animate(withDuration: animationDuration,
                       delay: 0,
                       options: UIView.AnimationOptions(rawValue: curve),
                       animations: {
                        self.view.layoutIfNeeded()
                    }, completion: nil)
    }
    
    //MARK: UI action methods
    @IBAction func cancelButtonPressed() {
        self.dismiss(animated: true, completion: nil)
    }
    
    @IBAction func handleTap(_ sender: UITapGestureRecognizer) {
        teamTextField.resignFirstResponder()
        problemTextField.resignFirstResponder()
    }
    
    
    @IBAction func actionChanged(_ sender: UISegmentedControl) {
        switch actionChooser.selectedSegmentIndex {
        case 0:
            QRManager.shared.action = Action.add
            print("Add action was chosen")
        case 1:
            QRManager.shared.action = Action.cancel
            print("Cancel action was chosen")
        default:
            QRManager.shared.action = Action.add
        }
    }
    
    @objc func nextButtonTappedFromNumericKeyboard() {
        problemTextField.becomeFirstResponder()
    }
    
    @objc func doneButtonTappedFromNumericKeyboard() {
        if let teamID = teamTextField.text, let problemID = problemTextField.text {
            if teamID.isEmpty || problemID.isEmpty {
                toastNotification.displayToast(message: "Please fill all text fields")
                problemTextField.resignFirstResponder()
            } else {
                QRManager.shared.process(with: teamID, and: problemID) { [weak self] (message) in
                    self?.toastNotification.displayToast(message: message)
                    self?.problemTextField.resignFirstResponder()
                }
            }
        }
    }
}

extension QRScannerVC: AVCaptureMetadataOutputObjectsDelegate {
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        if metadataObjects.count == 0 {
            qrCodeFrameView?.frame = CGRect.zero
            print("No QR code detected")
            return
        }
        
        if let metadataObj = metadataObjects.first as? AVMetadataMachineReadableCodeObject {
            if metadataObj.type == AVMetadataObject.ObjectType.qr {
                guard let barCodeObj = videoPreviewLayer?.transformedMetadataObject(for: metadataObj) else {
                    return
                }
                qrCodeFrameView?.frame = barCodeObj.bounds
                
                if let value = metadataObj.stringValue {
                    QRManager.shared.process(with: value, completion: { [weak self] message in
                        self?.toastNotification.displayToast(message: message)
                    })
                }
            }
        }
    }
}
