// Created by Konstantin Khvan on 7/6/18 1:08 PM

package com.pwarss.ttrs

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreType
import com.pwarss.model.User
import org.springframework.dao.IncorrectResultSizeDataAccessException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.security.crypto.codec.Hex
import org.springframework.stereotype.Service
import java.security.MessageDigest

@JsonIgnoreType
data class UserWithHashedPassword(@JsonIgnore val user: User,
                                  @JsonIgnore val hashedPassword: String)

/**
 * tt-rss db based user repository
 */
@Service
class UserServiceTtrss(private val jdbcTemplate: JdbcTemplate) {

    private class CheckPasswordRSRow(val id: Long, val pwdHash: String, val salt: String)

    fun checkPassword(loginArg: String?, passwordArg: String?): UserWithHashedPassword? {

        val login = loginArg?.trim() ?: ""
        val password = passwordArg ?: ""

        val mapper = RowMapper { rs, _ ->
            CheckPasswordRSRow(rs.getLong("id"), rs.getString("pwd_hash") ?: "", rs.getString("salt") ?: "")
        }

        val row = try {
            val query = "SELECT id, pwd_hash, salt FROM ttrss_users WHERE login=?"
            jdbcTemplate.queryForObject(query, arrayOf(login), mapper)
        } catch (e: IncorrectResultSizeDataAccessException) {
            null
        }

        if (row == null) {
            return null
        }

        val mode2 = row.pwdHash.startsWith("MODE2:")
        val passwordHash = encrypt_password(password, row.salt, mode2)
        if (row.pwdHash != passwordHash) {
            return null
        }

        return UserWithHashedPassword(User(row.id, login), passwordHash)
    }

    fun checkSessionIsStillValid(login: String, passwordHash: String): Boolean {
        val mapper = RowMapper { rs, _ ->
            CheckPasswordRSRow(rs.getLong("id"), rs.getString("pwd_hash") ?: "", "")
        }

        val row = try {
            val query = "SELECT id, pwd_hash, salt FROM ttrss_users WHERE login=?"
            jdbcTemplate.queryForObject(query, arrayOf(login), mapper)
        } catch (e: IncorrectResultSizeDataAccessException) {
            null
        }

        return passwordHash == row?.pwdHash
    }
}

// password function ported from tt-rss
// this may calculate wrong results since php strings are non unicode (looks like they are 8bit ascii)
@Suppress("FunctionName")
private fun encrypt_password(pass: String, salt: String = "", mode2: Boolean = false) = when {
    salt.isNotBlank() && mode2 -> "MODE2:${Sha256Encoder(salt + pass)}"
    salt.isNotBlank() -> "SHA1X:${Sha1Encoder("$salt:$pass")}"
    else -> "SHA1:${Sha1Encoder(pass)}"
}

private open class Encoder(algo: String) {
    private val digester = MessageDigest.getInstance(algo)

    operator fun invoke(str: String): String {
        val binaryHash = digester.digest(str.toByteArray())
        return String(Hex.encode(binaryHash))
    }
}

private object Sha1Encoder : Encoder("sha1")
private object Sha256Encoder : Encoder("SHA-256")
