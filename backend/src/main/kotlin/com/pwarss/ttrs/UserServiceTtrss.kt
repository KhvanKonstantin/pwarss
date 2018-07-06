// Created by Konstantin Khvan on 7/6/18 1:08 PM

package com.pwarss.ttrs

import org.springframework.dao.IncorrectResultSizeDataAccessException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.security.crypto.codec.Hex
import org.springframework.stereotype.Service
import java.security.MessageDigest

@Service
class UserServiceTtrss(private val jdbcTemplate: JdbcTemplate) {

    fun checkPassword(login: String, password: String): Boolean {
        class CheckPasswordRSRow(val pwdHash: String, val salt: String)

        val mapper = RowMapper { rs, _ ->
            CheckPasswordRSRow(rs.getString("pwd_hash") ?: "", rs.getString("salt") ?: "")
        }

        val row = try {
            val query = "SELECT pwd_hash, salt FROM ttrss_users WHERE login=?"
            jdbcTemplate.queryForObject(query, arrayOf(login), mapper)
        } catch (e: IncorrectResultSizeDataAccessException) {
            return false
        }

        if (row == null) {
            return false
        }

        val mode2 = row.pwdHash.startsWith("MODE2:")
        val passwordHash = encrypt_password(password, row.salt, mode2)
        return row.pwdHash == passwordHash
    }
}

// password function ported from tt-rss
// this may calculate wrong results since php strings are non unicode (looks like they are 8bit ascii)
private fun encrypt_password(pass: String, salt: String = "", mode2: Boolean = false) = when {
    salt.isNotBlank() && mode2 -> "MODE2:${Sha256Encoder(salt + pass)}"
    salt.isNotBlank() -> "SHA1X:${Sha1Encoder("$salt:$pass")}"
    else -> "SHA1:${Sha1Encoder(pass)}"
}

private open class Encoder(algo: String) {
    private val digester = MessageDigest.getInstance(algo);

    operator fun invoke(str: String): String {
        val binaryHash = digester.digest(str.toByteArray())
        return String(Hex.encode(binaryHash))
    }
}

private object Sha1Encoder : Encoder("sha1")
private object Sha256Encoder : Encoder("SHA-256")
