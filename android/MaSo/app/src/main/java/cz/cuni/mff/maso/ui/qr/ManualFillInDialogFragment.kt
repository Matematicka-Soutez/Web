package cz.cuni.mff.maso.ui.qr

import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.ViewModelProviders
import cz.cuni.mff.maso.R
import cz.cuni.mff.maso.databinding.DialogManualFillInBinding
import cz.cuni.mff.maso.tools.showKeyboardDelayed

interface ManualFillInDialogListener {
	fun onDataEntered(teamNo: Int, problemNo: Int)
	fun onDismissed()
}

interface ManualFillInView {
	fun cancelOverlay()
	fun onSubmitClicked()
}

class ManualFillInDialogFragment : DialogFragment() {

	companion object {
		val TAG = ManualFillInDialogFragment::class.java.simpleName

		fun newInstance() = ManualFillInDialogFragment()
	}

	val viewModel by lazy { ViewModelProviders.of(this).get(ManualFillInViewModel::class.java) }
	lateinit var listener: ManualFillInDialogListener
	private lateinit var binding: DialogManualFillInBinding

	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		isCancelable = true
		// set callback listener
		try {
			listener = activity as ManualFillInDialogListener
		} catch (e: ClassCastException) {
			throw ClassCastException(activity!!.toString() + " must implement " + ManualFillInDialogListener::class.java.name)
		}
	}

	override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
		binding = DialogManualFillInBinding.inflate(inflater, container, false)
		binding.setLifecycleOwner(this)
		binding.viewModel = viewModel
		binding.view = object : ManualFillInView {
			override fun cancelOverlay() {
				dismiss()
			}

			override fun onSubmitClicked() {
				val teamId = viewModel.teamId.value?.toIntOrNull()
				val problemId = viewModel.problemId.value?.toIntOrNull()
				if (teamId != null && problemId != null) {
					listener.onDataEntered(teamId, problemId)
					dismiss()
				} else {
					Toast.makeText(context, R.string.error_invalid_data, Toast.LENGTH_LONG).show()
				}
			}
		}
		return binding.root
	}

	override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
		super.onViewCreated(view, savedInstanceState)
		binding.teamIdInput.showKeyboardDelayed()
	}

	override fun onDismiss(dialog: DialogInterface?) {
		super.onDismiss(dialog)
		listener.onDismissed()
	}

	override fun onCancel(dialog: DialogInterface?) {
		super.onCancel(dialog)
		listener.onDismissed()
	}
}