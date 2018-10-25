package cz.cuni.mff.maso.api

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import java.util.Date

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

data class QrCodeEntity(val teamNumber: Int, val problemId: Int)

@JsonClass(generateAdapter = true)
data class QrRequestEntity(
	@Json(name = "action") val action: RequestTypeEnum,
	@Json(name = "team") val teamNumber: Int,
	@Json(name = "problem") val problemId: Int,
	@Json(name = "password") val password: String
)

@JsonClass(generateAdapter = true)
data class QrResponseEntity(
	@Json(name = "id") val id: Int,
	@Json(name = "competitionId") val competitionId: Int,
	@Json(name = "teamId") val teamId: Int,
	@Json(name = "teamNumber") val teamNumber: Int,
	@Json(name = "problemNumber") val problemId: Int,
	@Json(name = "solved") val solved: Boolean,
	@Json(name = "createdBy") val createdById: Int,
	@Json(name = "createdAt") val createdAt: Date,
	@Json(name = "updatedAt") val updatedAt: Date
)

enum class RequestTypeEnum(val value: String) {
	ADD("add"), CANCEL("cancel")
}

