package cz.cuni.mff.maso.ui.password

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import cz.cuni.mff.maso.R
import cz.cuni.mff.maso.databinding.ActivityPasswordBinding
import cz.cuni.mff.maso.tools.Preferences
import cz.cuni.mff.maso.ui.BaseActivity
import cz.cuni.mff.maso.ui.qr.QrScanActivity

interface PasswordView {
	fun onNextClicked()
}

private const val ARG_CHANGE_PASSWORD = "arg_change_password"

class PasswordActivity : BaseActivity<ActivityPasswordBinding, PasswordViewModel, PasswordView>() {
	override val layoutResId: Int = R.layout.activity_password
	override val viewModel by lazy { initViewModel<PasswordViewModel>() }
	override val view = object : PasswordView {
		override fun onNextClicked() {
			if (viewModel.updatePassword()) {
				startActivity(QrScanActivity.newIntent(this@PasswordActivity))
			}
		}
	}

	override fun displayBackArrow(): Boolean {
		return (intent.extras?.getByte(ARG_CHANGE_PASSWORD, 0.toByte()) ?: 0.toByte()) != 0.toByte()
	}

	companion object {
		fun newIntent(context: Context, changePassword: Boolean = false) = Intent(context, PasswordActivity::class.java).apply {
			putExtra(ARG_CHANGE_PASSWORD, (if (changePassword) 1 else 0).toByte())
		}
	}

	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		if (!displayBackArrow() && !Preferences.getPassword().isNullOrEmpty()) {
			startActivity(QrScanActivity.newIntent(this))
		}
	}

	override fun onCreateOptionsMenu(menu: Menu): Boolean {
		menuInflater.inflate(R.menu.menu_privacy_policy, menu)
		return super.onCreateOptionsMenu(menu)
	}

	override fun onOptionsItemSelected(item: MenuItem): Boolean {
		when (item.itemId) {
			R.id.action_privacy_policy -> {
				startPrivacyPolicyActivity()
				return true
			}
		}
		return super.onOptionsItemSelected(item)
	}
}
