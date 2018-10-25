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
    var captureSession = AVCaptureSession()
    var videoPreviewLayer: AVCaptureVideoPreviewLayer?
    var qrCodeFrameView: UIView?
    @IBOutlet weak var cancelButton: UIButton!
    @IBOutlet weak var toastNotification: Toast!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let captureDevice: AVCaptureDevice?
        
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
        
        
        qrCodeFrameView = UIView()
        if let qrCodeFrameView = qrCodeFrameView {
            qrCodeFrameView.layer.borderColor = UIColor.green.cgColor
            qrCodeFrameView.layer.borderWidth = 2
            view.addSubview(qrCodeFrameView)
            view.bringSubviewToFront(qrCodeFrameView)
        }
        
        cancelButton.layer.cornerRadius = 30
        cancelButton.backgroundColor = UIColor.white
        view.bringSubviewToFront(cancelButton)
        view.bringSubviewToFront(toastNotification)
        captureSession.startRunning()
    }
    
    @IBAction func cancelButtonPressed() {
        self.dismiss(animated: true, completion: nil)
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
