package cz.cuni.mff.maso.api

import android.app.Application
import android.content.Context
import android.net.ConnectivityManager
import android.os.Handler
import androidx.lifecycle.MutableLiveData
import com.squareup.moshi.FromJson
import com.squareup.moshi.Moshi
import com.squareup.moshi.ToJson
import com.squareup.moshi.adapters.Rfc3339DateJsonAdapter
import cz.cuni.mff.maso.App
import cz.cuni.mff.maso.BuildConfig
import cz.cuni.mff.maso.R
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.io.IOException
import java.util.Date
import java.util.concurrent.Executor
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

private val URL_BASE = if (BuildConfig.DEBUG) "https://maso-staging.herokuapp.com/" else "https://maso23.herokuapp.com/"

object RetrofitHelper {

	val instance by lazy { createRetrofit(createOkHttpClient(provideLoggingInterceptor()), URL_BASE, provideMoshi(), LiveDataCallAdapterFactory()) }
	private val executors by lazy { AppExecutors(Executors.newSingleThreadExecutor(), Executors.newFixedThreadPool(3), MainThreadExecutor(App.instance)) }

	private fun createOkHttpClient(loggingInterceptor: HttpLoggingInterceptor): OkHttpClient {
		val builder = OkHttpClient.Builder()
			.connectTimeout(30, TimeUnit.SECONDS)
			.readTimeout(30, TimeUnit.SECONDS)
			.writeTimeout(60, TimeUnit.SECONDS)
			.addInterceptor(loggingInterceptor)
			.addNetworkInterceptor(ConnectivityInterceptor(App.instance))
		return builder.build()
	}

	private fun provideLoggingInterceptor() = HttpLoggingInterceptor().apply {
		level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BODY else HttpLoggingInterceptor.Level.NONE
	}

	private fun provideMoshi(): Moshi = Moshi.Builder()
		.add(Date::class.java, Rfc3339DateJsonAdapter().nullSafe())
		.add(RequestTypeAdapter())
		.build()

	private fun createRetrofit(client: OkHttpClient, url: String, moshi: Moshi, callAdapterFactory: LiveDataCallAdapterFactory): Retrofit {
		return Retrofit.Builder()
			.client(client)
			.baseUrl(url)
			.addConverterFactory(MoshiConverterFactory.create(moshi))
			.addCallAdapterFactory(callAdapterFactory)
			.build()
	}

	fun <T> createRequest(call: Call<T>, action: ((T?) -> Unit)? = null) = MutableLiveData<Resource<T>>().apply {
		value = Resource.loading(null)
		executors.networkIO().execute {
			try {
				val response = call.execute()
				val apiResponse = ApiResponse.create(response)
				when (apiResponse) {
					is ApiSuccessResponse -> {
						executors.diskIO().execute {
							action?.invoke(apiResponse.body)
							postValue(Resource.success(apiResponse.body))
						}
					}
					is ApiEmptyResponse -> {
						executors.diskIO().execute {
							action?.invoke(null)
							postValue(Resource.success(null))
						}
					}
					is ApiErrorResponse -> {
						apiResponse.errorType
						postValue(Resource.error(apiResponse.errorMessage, apiResponse.errorType, null))
					}
				}
			} catch (e: IOException) {
				postValue(Resource.error(getFailMessage<T>(e), ApiResponse.create<T>(e).errorType, null))
			}
		}
	}

	fun <T> executeRequest(call: Call<T>, action: ((Resource<T>?) -> Unit)? = null) {
		executors.networkIO().execute {
			try {
				val response = call.execute()
				val apiResponse = ApiResponse.create(response)
				when (apiResponse) {
					is ApiSuccessResponse -> {
						executors.diskIO().execute {
							action?.invoke(Resource.success(apiResponse.body))
						}
					}
					is ApiEmptyResponse -> {
						executors.diskIO().execute {
							action?.invoke(Resource.success(null))
						}
					}
					is ApiErrorResponse -> {
						action?.invoke(Resource.error(apiResponse.errorMessage, apiResponse.errorType, null))
					}
				}
			} catch (e: IOException) {
				action?.invoke(Resource.error(getFailMessage<T>(e), ApiResponse.create<T>(e).errorType, null))
			}
		}
	}

	private fun <T> getFailMessage(t: Throwable) = App.instance.getString(when (ApiResponse.create<T>(t).errorType) {
		ErrorType.UNKNOWN_HOST -> R.string.global_network_unknown_host
		ErrorType.TIMEOUT -> R.string.global_network_timeout
		ErrorType.PARSE -> R.string.global_network_parse_fail
		ErrorType.NO_CONNECTIVITY -> R.string.global_network_offline
		else -> R.string.global_network_fail
	})

}

class ConnectivityInterceptor constructor(private val app: Application) : Interceptor {
	override fun intercept(chain: Interceptor.Chain?): okhttp3.Response {
		if (!isOnline(app)) throw NoConnectivityException()
		val builder = chain!!.request().newBuilder()
		return chain.proceed(builder.build())
	}
}

class NoConnectivityException : IOException() {
	override val message: String?
		get() = "No connectivity exception"
}

fun isOnline(context: Context): Boolean {
	val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
	return connectivityManager.activeNetworkInfo?.isConnected ?: false
}

class RequestTypeAdapter {
	@ToJson
	fun toJson(requestTypeEnum: RequestTypeEnum?) = requestTypeEnum?.value

	@FromJson
	fun fromJson(requestType: String?) = requestType?.let {
		when (it) {
			RequestTypeEnum.ADD.value -> RequestTypeEnum.ADD
			RequestTypeEnum.CANCEL.value -> RequestTypeEnum.CANCEL
			else -> null
		}
	}
}

class AppExecutors(private val diskIO: Executor, private val networkIO: Executor, private val mainThread: Executor) {

	fun diskIO() = diskIO

	fun networkIO() = networkIO

	fun mainThread() = mainThread
}

class MainThreadExecutor(app: Application) : Executor {
	private val mainThreadHandler = Handler(app.mainLooper)

	override fun execute(command: Runnable?) {
		mainThreadHandler.post(command)
	}
}
