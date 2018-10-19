package cz.cuni.mff.maso.api

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ErrorEntity(
	@Json(name = "message") val message: String,
	@Json(name = "type") val type: String?,
	@Json(name = "errors") val errors: List<ErrorItem>?
)

@JsonClass(generateAdapter = true)
data class ErrorItem(
	@Json(name = "error") val error: String,
	@Json(name = "rule") val rule: String,
	@Json(name = "field") val field: String
)

data class QrCodeEntity(val teamId: Int, val problemId: Int)

enum class RequestTypeEnum(val value: String) {
	ADD("add"), CANCEL("cancel")
}

