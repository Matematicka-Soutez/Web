package cz.cuni.mff.maso.ui.qr

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.Observer
import com.budiyev.android.codescanner.AutoFocusMode
import com.budiyev.android.codescanner.CodeScanner
import com.budiyev.android.codescanner.DecodeCallback
import com.budiyev.android.codescanner.ErrorCallback
import com.budiyev.android.codescanner.ScanMode
import com.google.android.material.snackbar.Snackbar
import com.google.zxing.BarcodeFormat
import cz.cuni.mff.maso.R
import cz.cuni.mff.maso.api.ErrorType
import cz.cuni.mff.maso.api.RequestTypeEnum
import cz.cuni.mff.maso.api.Status
import cz.cuni.mff.maso.databinding.ActivityQrScanBinding
import cz.cuni.mff.maso.ui.BaseActivity
import cz.cuni.mff.maso.ui.password.PasswordActivity

private const val PERMISSION_CAMERA_CODE = 69

interface QrScanView {
	fun cancelSuccess()
	fun cancelFail()
	fun actionFail()
	fun cameraPermissionClicked()
}

class QrScanActivity : BaseActivity<ActivityQrScanBinding, QrScanViewModel, QrScanView>() {

	override val layoutResId = R.layout.activity_qr_scan
	override val viewModel by lazy { initViewModel<QrScanViewModel>() }
	override val view = object : QrScanView {
		override fun cameraPermissionClicked() {
			requestCameraPermission()
		}

		override fun cancelSuccess() {
			viewModel.state.value = QrScreenState.SCANNING
		}

		override fun cancelFail() {
			viewModel.state.value = QrScreenState.SCANNING
		}

		override fun actionFail() {
			viewModel.state.value = QrScreenState.SCANNING
			if (viewModel.request.value?.errorType == ErrorType.UNAUTHORIZED) {
				startPasswordActivity()
			} else {
				viewModel.retry()
			}
		}
	}

	companion object {
		fun newIntent(context: Context) = Intent(context, QrScanActivity::class.java).apply {
			flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
		}
	}

	private lateinit var codeScanner: CodeScanner

	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		setupScanning()
		viewModel.request.observe(this, Observer {
			when (it.status) {
				Status.SUCCESS -> animateSuccess()
				Status.ERROR -> animateFail()
				Status.LOADING -> showProgress()
			}
		})
		viewModel.state.observe(this, Observer {
			binding.progressContainer.visibility = if (it == QrScreenState.PROGRESS) View.VISIBLE else View.GONE
			binding.successContainer.visibility = if (it == QrScreenState.SUCCESS) View.VISIBLE else View.INVISIBLE
			binding.failContainer.visibility = if (it == QrScreenState.ERROR) View.VISIBLE else View.INVISIBLE
			binding.permissionContainer.visibility = if (it == QrScreenState.PERMISSION_REQUIRED) View.VISIBLE else View.GONE
			if (it == QrScreenState.SCANNING) {
				viewModel.cancelDelayTimer()
				startScanning()
			}
		})
		initSpinner()
	}

	private fun initSpinner() {
		val options = resources.getStringArray(R.array.request_options)
		val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, options)
		adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
		binding.spinnerSelector.adapter = adapter
		binding.spinnerSelector.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
			override fun onItemSelected(adapterView: AdapterView<*>, view: View?, i: Int, l: Long) {
				viewModel.requestType = if (i == 1) RequestTypeEnum.CANCEL else RequestTypeEnum.ADD
			}

			override fun onNothingSelected(adapterView: AdapterView<*>) {}
		}
	}

	private fun showProgress() {
		viewModel.state.value = QrScreenState.PROGRESS
	}

	private fun animateFail() {
		viewModel.state.value = QrScreenState.ERROR
	}

	private fun animateSuccess() {
		viewModel.state.value = QrScreenState.SUCCESS
		viewModel.runDelayTimer()
	}

	override fun onCreateOptionsMenu(menu: Menu): Boolean {
		menuInflater.inflate(R.menu.menu_qr, menu)
		return super.onCreateOptionsMenu(menu)
	}

	override fun onOptionsItemSelected(item: MenuItem): Boolean {
		when (item.itemId) {
			R.id.action_change_password -> {
				startPasswordActivity()
				return true
			}
		}
		return super.onOptionsItemSelected(item)
	}

	private fun startPasswordActivity() {
		startActivity(PasswordActivity.newIntent(this, true))
	}

	override fun onStart() {
		super.onStart()
		if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
			requestCameraPermission()
		} else {
			if (viewModel.state.value == QrScreenState.PERMISSION_REQUIRED) {
				viewModel.state.value = QrScreenState.SCANNING
			} else if (viewModel.state.value == QrScreenState.SCANNING) {
				startScanning()
			}
		}
	}

	private fun requestCameraPermission() {
		viewModel.state.value = QrScreenState.SCANNING
		ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.CAMERA), PERMISSION_CAMERA_CODE)
	}

	override fun onStop() {
		stopScanning()
		super.onStop()
	}

	override fun onRequestPermissionsResult(requestCode: Int,
		permissions: Array<String>, grantResults: IntArray) {
		when (requestCode) {
			PERMISSION_CAMERA_CODE -> {
				// If request is cancelled, the result arrays are empty.
				if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
					// permission was granted, yay! Do the
					// contacts-related task you need to do.
					viewModel.state.value = QrScreenState.SCANNING
				} else {
					viewModel.state.value = QrScreenState.PERMISSION_REQUIRED
					Snackbar.make(binding.root, R.string.error_camera_permission_denied, Snackbar.LENGTH_INDEFINITE)
						.setAction(R.string.action_settings) {
							openAppSettings()
						}
						.setActionTextColor(ContextCompat.getColor(this, R.color.colorPrimary))
						.show()
				}
				return
			}

			// Add other 'when' lines to check for other
			// permissions this app might request.
			else -> {
				// Ignore all other requests.
			}
		}
	}

	private fun startScanning() {
		codeScanner.startPreview()
	}

	private fun stopScanning() {
		codeScanner.stopPreview()
	}

	private fun setupScanning() {
		codeScanner = CodeScanner(this, binding.scannerView)

		// Parameters (default values)
		codeScanner.camera = CodeScanner.CAMERA_BACK // or CAMERA_FRONT or specific camera id
		codeScanner.formats = listOf(BarcodeFormat.QR_CODE) // list of type BarcodeFormat,

		codeScanner.autoFocusMode = AutoFocusMode.SAFE // or CONTINUOUS
		codeScanner.scanMode = ScanMode.SINGLE // or CONTINUOUS or PREVIEW
		codeScanner.isAutoFocusEnabled = true // Whether to enable auto focus or not
		codeScanner.isFlashEnabled = false // Whether to enable flash or not

		// Callbacks
		codeScanner.decodeCallback = DecodeCallback {
			if (!viewModel.processQrCodeResult(it.text)) {
				runOnUiThread {
					Snackbar.make(binding.root, R.string.error_qr_code_format_not_valid, Snackbar.LENGTH_LONG).show()
					binding.scannerView.postDelayed({
						codeScanner.startPreview()
					}, 350)
				}
			}
		}
		codeScanner.errorCallback = ErrorCallback {
			runOnUiThread {

			}
		}
	}

	private fun openAppSettings() {
		val intent = Intent()
		intent.action = Settings.ACTION_APPLICATION_DETAILS_SETTINGS
		val uri = Uri.fromParts("package", packageName, null)
		intent.data = uri
		startActivity(intent)
	}

}