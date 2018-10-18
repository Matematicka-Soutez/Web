package cz.cuni.mff.maso

import cz.cuni.mff.maso.tools.ENCRYPTION_IV
import cz.cuni.mff.maso.tools.ENCRYPTION_KEY
import cz.cuni.mff.maso.tools.ENCRYPTION_SALT
import cz.cuni.mff.maso.tools.Encryption
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(RobolectricTestRunner::class)
class ExampleUnitTest {

	@Test
	fun encryptDecryptDataNonEmpty() {
		encryptDecrypt("yellow-envelope")
	}

	@Test
	fun encryptDecryptDataEmpty() {
		encryptDecrypt("")
	}

	@Test
	fun encryptDecryptDataNull() {
		encryptDecrypt(null)
	}

	private fun encryptDecrypt(value: String?) {
		val encrypted = encryption?.encryptOrNull(value)
		val decrypted = encryption?.decryptOrNull(encrypted)
		assertEquals(decrypted, value)
	}

	val encryption = Encryption.getDefault(ENCRYPTION_KEY, ENCRYPTION_SALT, ENCRYPTION_IV)
}
