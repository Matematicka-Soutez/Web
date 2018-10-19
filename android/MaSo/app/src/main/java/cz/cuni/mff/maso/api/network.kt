package cz.cuni.mff.maso.api

import android.app.Application
import android.content.Context
import android.net.ConnectivityManager
import com.squareup.moshi.FromJson
import com.squareup.moshi.Moshi
import com.squareup.moshi.ToJson
import com.squareup.moshi.adapters.Rfc3339DateJsonAdapter
import cz.cuni.mff.maso.App
import cz.cuni.mff.maso.BuildConfig
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.io.IOException
import java.util.Date
import java.util.concurrent.TimeUnit

private const val URL_BASE = "https://maso-staging.herokuapp.com/api/"

object RetrofitHelper {

	private val instance by lazy { createRetrofit(createOkHttpClient(provideLoggingInterceptor()), URL_BASE, provideMoshi(), LiveDataCallAdapterFactory()) }

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