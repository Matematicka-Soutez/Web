package cz.cuni.mff.maso

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations

private const val PASSWORD_MIN_LENGTH = 8

class MainViewModel : BaseViewModel() {
	val password = MutableLiveData<String>()
	val isPasswordValid: MutableLiveData<Boolean> = Transformations.map(password) { password.value?.length ?: 0 > PASSWORD_MIN_LENGTH } as MutableLiveData<Boolean>
}