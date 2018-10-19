package cz.cuni.mff.maso.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.databinding.DataBindingUtil
import androidx.databinding.ViewDataBinding
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProviders
import com.google.android.material.snackbar.Snackbar
import cz.cuni.mff.maso.BR
import cz.cuni.mff.maso.R
import cz.cuni.mff.maso.tools.EventObserver

abstract class BaseActivity<B : ViewDataBinding, VM : ViewModelInterface, V> : AppCompatActivity() {

	abstract val layoutResId: Int
	abstract val viewModel: VM
	abstract val view: V?
	lateinit var binding: B

	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		binding = DataBindingUtil.inflate(layoutInflater, layoutResId, null, false)
		binding.setLifecycleOwner(this)
		binding.setVariable(BR.viewModel, viewModel)
		view?.let { binding.setVariable(BR.view, it) }
		viewModel.message.observe(this, EventObserver { Snackbar.make(binding.root, it, Snackbar.LENGTH_LONG).show() })
		setContentView(binding.root)
		binding.root.findViewById<Toolbar>(R.id.toolbar)?.let {
			setSupportActionBar(it)
			supportActionBar?.setDisplayHomeAsUpEnabled(displayBackArrow())
		}
	}

	open fun displayBackArrow() = false

	inline fun <reified VM : ViewModel> initViewModel() = ViewModelProviders.of(this).get(VM::class.java)

}