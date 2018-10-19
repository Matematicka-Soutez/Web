package cz.cuni.mff.maso.ui.password

import android.view.Menu
import android.view.MenuItem
import cz.cuni.mff.maso.R
import cz.cuni.mff.maso.databinding.ActivityMainBinding
import cz.cuni.mff.maso.ui.BaseActivity
import cz.cuni.mff.maso.ui.qr.QrScanActivity

interface MainView {
	fun onNextClicked()
}

class MainActivity : BaseActivity<ActivityMainBinding, MainViewModel, MainView>() {
	override val layoutResId: Int = R.layout.activity_main
	override val viewModel by lazy { initViewModel<MainViewModel>() }
	override val view = object : MainView {
		override fun onNextClicked() {
			if (viewModel.updatePassword()) {
				startActivity(QrScanActivity.newIntent(this@MainActivity))
			}
		}
	}

	override fun onCreateOptionsMenu(menu: Menu): Boolean {
		// Inflate the menu; this adds items to the action bar if it is present.
		menuInflater.inflate(R.menu.menu_main, menu)
		return true
	}

	override fun onOptionsItemSelected(item: MenuItem): Boolean {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		return when (item.itemId) {
			R.id.action_settings -> true
			else -> super.onOptionsItemSelected(item)
		}
	}
}
