package cz.cuni.mff.maso.ui.qr

import androidx.lifecycle.MutableLiveData
import cz.cuni.mff.maso.ui.BaseViewModel

class ManualFillInViewModel : BaseViewModel() {
	val teamId = MutableLiveData<String>()
	val problemId = MutableLiveData<String>()
}