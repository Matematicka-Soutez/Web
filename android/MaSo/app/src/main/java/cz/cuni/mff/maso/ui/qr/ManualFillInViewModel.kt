package cz.cuni.mff.maso.ui.qr

import androidx.lifecycle.MutableLiveData
import cz.cuni.mff.maso.ui.BaseViewModel

class ManualFillInViewModel : BaseViewModel() {
	val teamNumber = MutableLiveData<String>()
	val problemId = MutableLiveData<String>()
}