package cz.cuni.mff.maso.tools

import android.content.res.ColorStateList
import android.widget.ImageView
import androidx.annotation.DrawableRes
import androidx.databinding.BindingAdapter
import androidx.vectordrawable.graphics.drawable.VectorDrawableCompat
import com.google.android.material.floatingactionbutton.FloatingActionButton

@BindingAdapter("fabBgColor")
fun FloatingActionButton.setColor(color: Int) {
	backgroundTintList = ColorStateList.valueOf(color)
}

@BindingAdapter("srcImage")
fun ImageView.setSrcImage(@DrawableRes drawableRes: Int) {
	setImageDrawable(VectorDrawableCompat.create(context.resources, drawableRes, context.theme))
}