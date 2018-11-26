package cz.cuni.mff.maso.api

import android.net.ParseException
import android.util.MalformedJsonException
import androidx.lifecycle.LiveData
import com.squareup.moshi.JsonDataException
import com.squareup.moshi.Moshi
import retrofit2.Call
import retrofit2.CallAdapter
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Status of a resource that is provided to the UI.
 *
 *
 * These are usually created by the Repository classes where they return
 * `LiveData<Resource<T>>` to pass back the latest data to the UI with its fetch status.
 */
enum class Status {
	SUCCESS,
	ERROR,
	LOADING
}

@Suppress("DataClassPrivateConstructor")
data class NetworkState private constructor(
	val status: Status,
	val msg: String? = null) {
	companion object {
		val SUCCESS = NetworkState(Status.SUCCESS)
		val LOADING = NetworkState(Status.LOADING)
		fun error(msg: String?) = NetworkState(Status.ERROR, msg)
	}
}

/**
 * A generic class that holds a value with its loading status.
 * @param <T>
</T> */
data class Resource<out T>(val status: Status, val data: T?, val message: String?, val errorType: ErrorType?) {
	companion object {
		fun <T> success(data: T?): Resource<T> {
			return Resource(Status.SUCCESS, data, null, null)
		}

		fun <T> error(msg: String, errorType: ErrorType, data: T?): Resource<T> {
			return Resource(Status.ERROR, data, msg, errorType)
		}

		fun <T> loading(data: T?): Resource<T> {
			return Resource(Status.LOADING, data, null, null)
		}
	}
}

enum class ErrorType(val type: String) {
	UNKNOWN_HOST("E_UNKNOWN_HOST"),
	TIMEOUT("E_TIMEOUT"),
	PARSE("E_PARSE"),
	NO_CONNECTIVITY("E_NO_CONNECTIVITY"),
	UNAUTHORIZED("UNAUTHORIZED"),
	BAD_REQUEST("BAD_REQUEST"),
	UNKNOWN("UNKNOWN")
}

/**
 * Common class used by API responses.
 * @param <T> the type of the response object
</T> */
@Suppress("unused") // T is used in extending classes
sealed class ApiResponse<T> {
	companion object {
		private val errorAdapter = Moshi.Builder().build().adapter<ErrorEntity>(ErrorEntity::class.java)

		fun <T> create(error: Throwable): ApiErrorResponse<T> {
			error.printStackTrace()
			return ApiErrorResponse(error.message ?: "unknown error", when (error) {
				is UnknownHostException -> ErrorType.UNKNOWN_HOST
				is SocketTimeoutException -> ErrorType.TIMEOUT
				is JsonDataException,
				is MalformedJsonException,
				is ParseException,
				is NumberFormatException,
				is ClassCastException -> ErrorType.PARSE
				is NoConnectivityException -> ErrorType.NO_CONNECTIVITY
				else -> ErrorType.UNKNOWN
			})
		}

		fun <T> create(response: Response<T>): ApiResponse<T> {
			return if (response.isSuccessful) {
				val body = response.body()
				if (body == null || response.code() == 204) {
					ApiEmptyResponse()
				} else {
					ApiSuccessResponse(body = body)
				}
			} else {
				if (response.code() == 304) {
					ApiEmptyResponse()
				} else {
					val error = response.errorBody()?.string()?.let { errorAdapter.fromJson(it) }
					if (error != null) ApiErrorResponse(error.message, when (error.type ?: ErrorType.UNKNOWN.type) {
						ErrorType.BAD_REQUEST.type -> ErrorType.BAD_REQUEST
						ErrorType.NO_CONNECTIVITY.type -> ErrorType.NO_CONNECTIVITY
						ErrorType.PARSE.type -> ErrorType.PARSE
						ErrorType.UNKNOWN_HOST.type -> ErrorType.UNKNOWN_HOST
						ErrorType.TIMEOUT.type -> ErrorType.TIMEOUT
						ErrorType.UNAUTHORIZED.type -> ErrorType.UNAUTHORIZED
						else -> ErrorType.UNKNOWN
					})
					else ApiErrorResponse("unknown error")
				}
			}
		}
	}
}

/**
 * separate class for HTTP 204 resposes so that we can make ApiSuccessResponse's body non-null.
 */
class ApiEmptyResponse<T> : ApiResponse<T>()

data class ApiSuccessResponse<T>(val body: T) : ApiResponse<T>()

data class ApiErrorResponse<T>(val errorMessage: String, val errorType: ErrorType = ErrorType.UNKNOWN) : ApiResponse<T>()

/**
 * A Retrofit adapter that converts the Call into a LiveData of ApiResponse.
 * @param <R>
 */
class LiveDataCallAdapter<R>(private val responseType: Type) : CallAdapter<R, LiveData<ApiResponse<R>>> {

	override fun responseType(): Type {
		return responseType
	}

	override fun adapt(call: Call<R>): LiveData<ApiResponse<R>> {
		return object : LiveData<ApiResponse<R>>() {
			var started = AtomicBoolean(false)
			override fun onActive() {
				super.onActive()
				if (started.compareAndSet(false, true)) {
					call.enqueue(object : Callback<R> {
						override fun onResponse(call: Call<R>, response: Response<R>) {
							postValue(ApiResponse.create(response))
						}

						override fun onFailure(call: Call<R>, throwable: Throwable) {
							throwable.printStackTrace()
							postValue(ApiResponse.create(throwable))
						}
					})
				}
			}
		}
	}
}

class LiveDataCallAdapterFactory : CallAdapter.Factory() {
	override fun get(returnType: Type, annotations: Array<Annotation>, retrofit: Retrofit): CallAdapter<*, *>? {
		if (getRawType(returnType) != LiveData::class.java) {
			return null
		}
		val observableType = getParameterUpperBound(0, returnType as ParameterizedType)
		val rawObservableType = getRawType(observableType)
		if (rawObservableType != ApiResponse::class.java) {
			throw IllegalArgumentException("type must be a resource")
		}
		if (observableType !is ParameterizedType) {
			throw IllegalArgumentException("resource must be parameterized")
		}
		val bodyType = getParameterUpperBound(0, observableType)
		return LiveDataCallAdapter<Any>(bodyType)
	}
}