package cz.cuni.mff.maso.ui.password

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations
import cz.cuni.mff.maso.tools.Preferences
import cz.cuni.mff.maso.ui.BaseViewModel

private const val PASSWORD_MIN_LENGTH = 8

class PasswordViewModel : BaseViewModel() {

	val password = MutableLiveData<String>()
	val isPasswordValid: MutableLiveData<Boolean> = Transformations.map(password) { password.value?.length ?: 0 >= PASSWORD_MIN_LENGTH } as MutableLiveData<Boolean>

	fun updatePassword(): Boolean {
		password.value?.let {
			Preferences.setPassword(it)
			return true
		}
		return false
	}
}