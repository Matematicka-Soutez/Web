package cz.cuni.mff.maso.ui.qr

import cz.cuni.mff.maso.api.QrCodeEntity
import cz.cuni.mff.maso.ui.BaseViewModel
import java.util.regex.Pattern

class QrScanViewModel : BaseViewModel() {

	private val patternAll = Pattern.compile("T\\d+P\\d+")
	private val patternTeam = Pattern.compile("T(\\d+)")
	private val patternProblem = Pattern.compile("P(\\d+)")

	fun processQrCodeResult(text: String?): Boolean {
		val qrCodeEntity = extractDataFromQrCode(text)
		if (qrCodeEntity != null) {
			callApiRequest()
			return true
		}
		return false
	}

	private fun callApiRequest() {

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