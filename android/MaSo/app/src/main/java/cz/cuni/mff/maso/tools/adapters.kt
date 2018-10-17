package cz.cuni.mff.maso.tools

import android.content.res.ColorStateList
import androidx.databinding.BindingAdapter
import com.google.android.material.floatingactionbutton.FloatingActionButton

@BindingAdapter("fabBgColor")
fun FloatingActionButton.setColor(color: Int) {
	backgroundTintList = ColorStateList.valueOf(color)
}