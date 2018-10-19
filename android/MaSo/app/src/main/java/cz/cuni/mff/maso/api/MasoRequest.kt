package cz.cuni.mff.maso.api

import androidx.lifecycle.LiveData
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.PUT

interface MasoRequest {
	@PUT("/competitions/current/team-solutions")
	fun sendQrCode(@Body body: QrRequestEntity): LiveData<Response<QrResponseEntity>>
}