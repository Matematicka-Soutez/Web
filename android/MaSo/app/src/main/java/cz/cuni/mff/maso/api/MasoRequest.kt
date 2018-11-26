package cz.cuni.mff.maso.api

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.PUT

interface MasoRequest {
	@PUT("/api/competitions/current/team-solutions")
	fun sendQrCode(@Body body: QrRequestEntity): Call<QrResponseEntity>
}