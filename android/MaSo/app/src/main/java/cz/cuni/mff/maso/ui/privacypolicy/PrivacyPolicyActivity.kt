package cz.cuni.mff.maso.ui.privacypolicy

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import cz.cuni.mff.maso.R
import cz.cuni.mff.maso.databinding.ActivityPrivacyPolicyBinding

private const val PRIVACY_POLICY_URL = "http://maso.mff.cuni.cz/policy.txt"

class PrivacyPolicyActivity : AppCompatActivity() {

	companion object {
		fun newIntent(context: Context) = Intent(context, PrivacyPolicyActivity::class.java)
	}

	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		val binding = DataBindingUtil.inflate<ActivityPrivacyPolicyBinding>(layoutInflater, R.layout.activity_privacy_policy, null, false)
		setContentView(binding.root)
		setSupportActionBar(binding.toolbar)
		supportActionBar?.setDisplayHomeAsUpEnabled(true)
		binding.webView.loadUrl(PRIVACY_POLICY_URL)
	}

	override fun onOptionsItemSelected(item: MenuItem): Boolean {
		if (item.itemId == android.R.id.home) {
			finish()
			return true
		}
		return super.onOptionsItemSelected(item)
	}
}