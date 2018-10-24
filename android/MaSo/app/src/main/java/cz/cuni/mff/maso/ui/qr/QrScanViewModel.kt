package cz.cuni.mff.maso.ui.qr

import android.os.Handler
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations
import cz.cuni.mff.maso.api.MasoRequest
import cz.cuni.mff.maso.api.QrCodeEntity
import cz.cuni.mff.maso.api.QrRequestEntity
import cz.cuni.mff.maso.api.QrResponseEntity
import cz.cuni.mff.maso.api.RequestTypeEnum
import cz.cuni.mff.maso.api.Resource
import cz.cuni.mff.maso.api.RetrofitHelper
import cz.cuni.mff.maso.tools.Preferences
import cz.cuni.mff.maso.ui.BaseViewModel
import java.util.regex.Pattern

private const val HIDE_SUCCESS_DELAY = 10000L

class QrScanViewModel : BaseViewModel() {

	val state = MutableLiveData<QrScreenState>().apply { value = QrScreenState.SCANNING }

	private var delayHandler: Handler? = null
	private var delayRunnable: Runnable? = null

	private val patternAll = Pattern.compile("T\\d+P\\d+")
	private val patternTeam = Pattern.compile("T(\\d+)")
	private val patternProblem = Pattern.compile("P(\\d+)")
	private val requestEntity = MutableLiveData<QrRequestEntity?>()
	var requestType = RequestTypeEnum.ADD
	val request: LiveData<Resource<QrResponseEntity>> = Transformations.switchMap(requestEntity) { it ->
		it?.let { RetrofitHelper.createRequest(RetrofitHelper.instance.create(MasoRequest::class.java).sendQrCode(it)) }
	}

	fun processQrCodeResult(text: String?): Boolean {
		val qrCodeEntity = extractDataFromQrCode(text)
		qrCodeEntity?.let {
			sendRequest(it.teamId, it.problemId, requestType)
			return true
		}
		return false
	}

	fun retry() {
		val tempRequestEntity = requestEntity.value?.copy()
		requestEntity.value = null
		requestEntity.value = tempRequestEntity
	}

	private fun callApiRequest(requestBody: QrRequestEntity) {
		requestEntity.postValue(requestBody)
	}

	private fun extractDataFromQrCode(text: String?): QrCodeEntity? {
		text?.let {
			//if the whole code doesn't match the required format, return null
			if (!patternAll.matcher(text).find()) {
				return null
			}
			var teamId: Int? = null
			var problemId: Int? = null
			val teamMatcher = patternTeam.matcher(text)
			val problemMatcher = patternProblem.matcher(text)
			if (teamMatcher.find()) {
				teamId = teamMatcher.group(1).toIntOrNull()
			}
			if (problemMatcher.find()) {
				problemId = problemMatcher.group(1).toIntOrNull()
			}
			if (teamId != null && problemId != null) {
				return QrCodeEntity(teamId, problemId)
			}
		}
		return null
	}

	override fun onCleared() {
		super.onCleared()
		cancelDelayTimer()
	}

	fun runDelayTimer() {
		delayHandler = Handler()
		delayRunnable = Runnable {
			state.value = QrScreenState.SCANNING
		}
		delayHandler!!.postDelayed(delayRunnable, HIDE_SUCCESS_DELAY)
	}

	fun cancelDelayTimer() {
		delayRunnable?.run {
			delayHandler?.removeCallbacks(this)
			delayHandler = null
			delayRunnable = null
		}
	}

	fun sendRequest(teamId: Int, problemId: Int, requestType: RequestTypeEnum) {
		callApiRequest(QrRequestEntity(requestType, teamId, problemId, Preferences.getPassword()!!))
	}
}