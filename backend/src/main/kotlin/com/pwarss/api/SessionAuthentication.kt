// Created by Konstantin Khvan on 7/9/18 6:06 PM

package com.pwarss.api

import com.pwarss.ttrs.UserWithHashedPassword
import org.springframework.stereotype.Component
import org.springframework.web.context.annotation.SessionScope
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.context.request.RequestAttributes
import java.util.concurrent.atomic.AtomicLong
import java.util.concurrent.atomic.AtomicReference
import javax.servlet.http.HttpSession

/**
 * Session bound component with logged in user info (if one is logged in)
 */
@Component
@SessionScope
class SessionAuthentication {
    val user: AtomicReference<UserWithHashedPassword?> = AtomicReference(null)

    fun login(user: UserWithHashedPassword) = this.user.set(user)

    fun logout() = user.set(null)

    private val userStillExistsCounter = AtomicLong()
    val userStillExistsCounterNext: Long
        get() = userStillExistsCounter.incrementAndGet()
}

const val SESSION_AUTHENTICATION_KEY = "scopedTarget.sessionAuthentication"

fun NativeWebRequest?.authentication() = this?.getAttribute(SESSION_AUTHENTICATION_KEY, RequestAttributes.SCOPE_SESSION) as? SessionAuthentication
fun NativeWebRequest?.userWithHashedPassword() = this?.authentication()?.user?.get()
fun NativeWebRequest?.user() = this?.userWithHashedPassword()?.user

fun HttpSession?.authentication() = this?.getAttribute(SESSION_AUTHENTICATION_KEY) as? SessionAuthentication
fun HttpSession?.userWithHashedPassword() = this?.authentication()?.user?.get()
fun HttpSession?.user() = this?.userWithHashedPassword()?.user