package cz.cuni.mff.maso.tools

import android.preference.PreferenceManager
import cz.cuni.mff.maso.App

const val ENCRYPTION_KEY = "5_-mN%HkjCt{C!CS15%Ao\$2_{)GXB\$aqA(BkCUHDyq#Oht[--O,]T}QzS)[y7@H?"
const val ENCRYPTION_SALT = "HUohnASx:N|mX0DS@EL;-fMK>tyjiTpGfOh@X*9X{~b;O9/p%!`eTDGAY-+~rNpL"
val ENCRYPTION_IV = ByteArray(16)
private const val PREF_PASSWORD = "pref_password"

object Preferences {

	val encryption = Encryption.getDefault(ENCRYPTION_KEY, ENCRYPTION_SALT, ENCRYPTION_IV)
	private val sharedPreferences = PreferenceManager.getDefaultSharedPreferences(App.instance)

	fun clearPreferences() {
		sharedPreferences.edit().clear().apply();
	}

	fun setPassword(value: String) {
		sharedPreferences.edit().putString(PREF_PASSWORD, encryption?.encryptOrNull(value)).apply()
	}

	fun getPassword(): String? {
		return encryption?.decryptOrNull(sharedPreferences.getString(PREF_PASSWORD, null))
	}

}