package cz.cuni.mff.maso.ui.qr

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

class QrScanViewModel : BaseViewModel() {

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
			callApiRequest(QrRequestEntity(requestType, it.teamId, it.problemId, Preferences.getPassword()!!))
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

}