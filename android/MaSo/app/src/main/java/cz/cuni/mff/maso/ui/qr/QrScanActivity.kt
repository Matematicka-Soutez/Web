package cz.cuni.mff.maso.ui.qr

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
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
import cz.cuni.mff.maso.api.Status
import cz.cuni.mff.maso.databinding.ActivityQrScanBinding
import cz.cuni.mff.maso.ui.BaseActivity
import cz.cuni.mff.maso.ui.password.PasswordActivity

private const val PERMISSION_CAMERA_CODE = 69
private const val HIDE_SUCCESS_DELAY = 3000L

interface QrScanView {
	fun cancelSuccess()
	fun cancelFail()
	fun actionFail()
}

class QrScanActivity : BaseActivity<ActivityQrScanBinding, QrScanViewModel, QrScanView>() {

	override val layoutResId = R.layout.activity_qr_scan
	override val viewModel by lazy { initViewModel<QrScanViewModel>() }
	override val view = object : QrScanView {
		override fun cancelSuccess() {
			binding.successContainer.visibility = View.GONE
			startScanning()
		}

		override fun cancelFail() {
			binding.failContainer.visibility = View.GONE
			startScanning()
		}

		override fun actionFail() {
			binding.failContainer.visibility = View.GONE
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
		binding.failContainer.visibility = View.GONE
		binding.progressContainer.visibility = View.GONE
		binding.successContainer.visibility = View.GONE
		viewModel.request.observe(this, Observer {
			when (it.status) {
				Status.SUCCESS -> animateSuccess()
				Status.ERROR -> animateFail()
				Status.LOADING -> showProgress()
			}
		})
	}

	private fun showProgress() {
		binding.progressContainer.visibility = View.VISIBLE
	}

	private fun animateFail() {
		binding.progressContainer.visibility = View.GONE
		binding.failContainer.visibility = View.VISIBLE
	}

	private fun animateSuccess() {
		binding.progressContainer.visibility = View.GONE
		binding.successContainer.visibility = View.VISIBLE
		binding.successContainer.postDelayed({
			binding.successContainer.visibility = View.GONE
			startScanning()
		}, HIDE_SUCCESS_DELAY)
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
			ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.CAMERA), PERMISSION_CAMERA_CODE)
		} else {
			startScanning()
		}
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
				} else {
					Snackbar.make(binding.root, R.string.error_camera_permission_denied, Snackbar.LENGTH_LONG)
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

}