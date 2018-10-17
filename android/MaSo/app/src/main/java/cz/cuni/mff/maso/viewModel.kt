package cz.cuni.mff.maso

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import cz.cuni.mff.maso.tools.Event

interface ViewModelInterface {
	val message: MutableLiveData<Event<String>>

	fun showMessage(text: String) {
		message.value = Event(text)
	}
}

abstract class BaseViewModel : ViewModel(), ViewModelInterface {
	override val message = MutableLiveData<Event<String>>()
}