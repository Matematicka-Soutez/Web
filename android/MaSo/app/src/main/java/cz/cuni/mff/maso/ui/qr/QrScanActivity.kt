package cz.cuni.mff.maso.ui.qr

import android.content.Context
import android.content.Intent
import cz.cuni.mff.maso.R
import cz.cuni.mff.maso.databinding.ActivityQrScanBinding
import cz.cuni.mff.maso.ui.BaseActivity

interface QrScanView {

}

class QrScanActivity : BaseActivity<ActivityQrScanBinding, QrScanViewModel, QrScanView>() {
	override val layoutResId = R.layout.activity_qr_scan
	override val viewModel by lazy { initViewModel<QrScanViewModel>() }
	override val view = object : QrScanView {

	}

	companion object {
		fun newIntent(context: Context) = Intent(context, QrScanActivity::class.java)
	}
}