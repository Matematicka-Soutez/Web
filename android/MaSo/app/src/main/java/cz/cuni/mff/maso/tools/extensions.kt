package cz.cuni.mff.maso.tools

import android.content.Context
import android.view.inputmethod.InputMethodManager
import android.widget.EditText

fun EditText.showKeyboard() {
	val imm = context.getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager
	imm?.let {
		this.requestFocus()
		it.showSoftInput(this, InputMethodManager.SHOW_IMPLICIT)
	}
}

fun EditText.showKeyboardDelayed() {
	postDelayed({ showKeyboard() }, 150)
}