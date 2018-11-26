package cz.cuni.mff.maso.tools

import android.util.Base64
import java.io.UnsupportedEncodingException
import java.security.InvalidAlgorithmParameterException
import java.security.InvalidKeyException
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.security.SecureRandom
import java.security.spec.InvalidKeySpecException
import javax.crypto.BadPaddingException
import javax.crypto.Cipher
import javax.crypto.IllegalBlockSizeException
import javax.crypto.NoSuchPaddingException
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

class Encryption private constructor(private val mBuilder: Builder) {

	@Throws(UnsupportedEncodingException::class,
		NoSuchAlgorithmException::class,
		NoSuchPaddingException::class,
		InvalidAlgorithmParameterException::class,
		InvalidKeyException::class,
		InvalidKeySpecException::class,
		BadPaddingException::class,
		IllegalBlockSizeException::class)
	private fun encrypt(data: String?): String? {
		if (data == null) return null
		val secretKey = getSecretKey(hashTheKey(mBuilder.getKey()))
		val dataBytes = data.toByteArray(charset(mBuilder.getCharsetName()))
		val cipher = Cipher.getInstance(mBuilder.getAlgorithm())
		cipher.init(Cipher.ENCRYPT_MODE, secretKey, mBuilder.getIvParameterSpec(), mBuilder.getSecureRandom())
		return Base64.encodeToString(cipher.doFinal(dataBytes), mBuilder.getBase64Mode())
	}

	fun encryptOrNull(data: String?): String? {
		return try {
			encrypt(data)
		} catch (e: Exception) {
			e.printStackTrace()
			null
		}
	}

	fun encryptAsync(data: String, callback: Callback?) {
		if (callback == null) return
		Thread(Runnable {
			try {
				val encrypt = encrypt(data)
				if (encrypt == null) {
					callback.onError(Exception("Encrypt return null, it normally occurs when you send a null data"))
				}
				callback.onSuccess(encrypt)
			} catch (e: Exception) {
				callback.onError(e)
			}
		}).start()
	}

	@Throws(UnsupportedEncodingException::class,
		NoSuchAlgorithmException::class,
		InvalidKeySpecException::class,
		NoSuchPaddingException::class,
		InvalidAlgorithmParameterException::class,
		InvalidKeyException::class,
		BadPaddingException::class,
		IllegalBlockSizeException::class)
	private fun decrypt(data: String?): String? {
		if (data == null) return null
		val dataBytes = Base64.decode(data, mBuilder.getBase64Mode())
		val secretKey = getSecretKey(hashTheKey(mBuilder.getKey()))
		val cipher = Cipher.getInstance(mBuilder.getAlgorithm())
		cipher.init(Cipher.DECRYPT_MODE, secretKey, mBuilder.getIvParameterSpec(), mBuilder.getSecureRandom())
		val dataBytesDecrypted = cipher.doFinal(dataBytes)
		return String(dataBytesDecrypted)
	}

	fun decryptOrNull(data: String?): String? {
		return try {
			decrypt(data)
		} catch (e: Exception) {
			e.printStackTrace()
			null
		}

	}

	fun decryptAsync(data: String, callback: Callback?) {
		if (callback == null) return
		Thread(Runnable {
			try {
				val decrypt = decrypt(data)
				if (decrypt == null) {
					callback.onError(Exception("Decrypt return null, it normally occurs when you send a null data"))
				}
				callback.onSuccess(decrypt)
			} catch (e: Exception) {
				callback.onError(e)
			}
		}).start()
	}

	@Throws(NoSuchAlgorithmException::class, UnsupportedEncodingException::class, InvalidKeySpecException::class)
	private fun getSecretKey(key: CharArray): SecretKey {
		val factory = SecretKeyFactory.getInstance(mBuilder.getSecretKeyType())
		val spec = PBEKeySpec(key, mBuilder.getSalt().toByteArray(charset(mBuilder.getCharsetName())), mBuilder.getIterationCount(), mBuilder.getKeyLength())
		val tmp = factory.generateSecret(spec)
		return SecretKeySpec(tmp.encoded, mBuilder.getKeyAlgorithm())
	}

	@Throws(UnsupportedEncodingException::class, NoSuchAlgorithmException::class)
	private fun hashTheKey(key: String): CharArray {
		val messageDigest = MessageDigest.getInstance(mBuilder.getDigestAlgorithm())
		messageDigest.update(key.toByteArray(charset(mBuilder.getCharsetName())))
		return Base64.encodeToString(messageDigest.digest(), Base64.NO_PADDING).toCharArray()
	}

	interface Callback {
		fun onSuccess(result: String?)
		fun onError(exception: Exception)
	}

	private class Builder {

		private var mIv: ByteArray? = null
		private var mKeyLength: Int = 0
		private var mBase64Mode: Int = 0
		private var mIterationCount: Int = 0
		private lateinit var mSalt: String
		private lateinit var mKey: String
		private lateinit var mAlgorithm: String
		private lateinit var mKeyAlgorithm: String
		private lateinit var mCharsetName: String
		private lateinit var mSecretKeyType: String
		private lateinit var mDigestAlgorithm: String
		private lateinit var mSecureRandomAlgorithm: String
		private lateinit var mSecureRandom: SecureRandom
		private lateinit var mIvParameterSpec: IvParameterSpec

		@Throws(NoSuchAlgorithmException::class)
		fun build(): Encryption {
			setSecureRandom(SecureRandom.getInstance(getSecureRandomAlgorithm()))
			setIvParameterSpec(IvParameterSpec(getIv()))
			return Encryption(this)
		}

		fun getCharsetName(): String {
			return mCharsetName
		}

		fun setCharsetName(charsetName: String): Builder {
			mCharsetName = charsetName
			return this
		}

		fun getAlgorithm(): String {
			return mAlgorithm
		}

		fun setAlgorithm(algorithm: String): Builder {
			mAlgorithm = algorithm
			return this
		}

		fun getKeyAlgorithm(): String {
			return mKeyAlgorithm
		}

		fun setKeyAlgorithm(keyAlgorithm: String): Builder {
			mKeyAlgorithm = keyAlgorithm
			return this
		}

		fun getBase64Mode(): Int {
			return mBase64Mode
		}

		fun setBase64Mode(base64Mode: Int): Builder {
			mBase64Mode = base64Mode
			return this
		}

		fun getSecretKeyType(): String {
			return mSecretKeyType
		}

		fun setSecretKeyType(secretKeyType: String): Builder {
			mSecretKeyType = secretKeyType
			return this
		}

		fun getSalt(): String {
			return mSalt
		}

		fun setSalt(salt: String): Builder {
			mSalt = salt
			return this
		}

		fun getKey(): String {
			return mKey
		}

		fun setKey(key: String): Builder {
			mKey = key
			return this
		}

		fun getKeyLength(): Int {
			return mKeyLength
		}

		fun setKeyLength(keyLength: Int): Builder {
			mKeyLength = keyLength
			return this
		}

		fun getIterationCount(): Int {
			return mIterationCount
		}

		fun setIterationCount(iterationCount: Int): Builder {
			mIterationCount = iterationCount
			return this
		}

		fun getSecureRandomAlgorithm(): String {
			return mSecureRandomAlgorithm
		}

		fun setSecureRandomAlgorithm(secureRandomAlgorithm: String): Builder {
			mSecureRandomAlgorithm = secureRandomAlgorithm
			return this
		}

		fun getIv(): ByteArray? {
			return mIv
		}

		fun setIv(iv: ByteArray): Builder {
			mIv = iv
			return this
		}

		fun getSecureRandom(): SecureRandom? {
			return mSecureRandom
		}

		fun setSecureRandom(secureRandom: SecureRandom): Builder {
			mSecureRandom = secureRandom
			return this
		}

		fun getIvParameterSpec(): IvParameterSpec? {
			return mIvParameterSpec
		}

		fun setIvParameterSpec(ivParameterSpec: IvParameterSpec): Builder {
			mIvParameterSpec = ivParameterSpec
			return this
		}

		fun getDigestAlgorithm(): String? {
			return mDigestAlgorithm
		}

		fun setDigestAlgorithm(digestAlgorithm: String): Builder {
			mDigestAlgorithm = digestAlgorithm
			return this
		}

		companion object {

			fun getDefaultBuilder(key: String, salt: String, iv: ByteArray): Builder {
				return Builder()
					.setIv(iv)
					.setKey(key)
					.setSalt(salt)
					.setKeyLength(128)
					.setKeyAlgorithm("AES")
					.setCharsetName("UTF8")
					.setIterationCount(1)
					.setDigestAlgorithm("SHA1")
					.setBase64Mode(Base64.DEFAULT)
					.setAlgorithm("AES/CBC/PKCS5Padding")
					.setSecureRandomAlgorithm("SHA1PRNG")
					.setSecretKeyType("PBKDF2WithHmacSHA1")
			}
		}

	}

	companion object {

		fun getDefault(key: String, salt: String, iv: ByteArray): Encryption? {
			return try {
				Builder.getDefaultBuilder(key, salt, iv).build()
			} catch (e: NoSuchAlgorithmException) {
				e.printStackTrace()
				null
			}

		}
	}
}