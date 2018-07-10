// Created by Konstantin Khvan on 7/9/18 6:06 PM

package com.pwarss.api

import com.pwarss.model.User
import org.springframework.stereotype.Component
import org.springframework.web.context.annotation.SessionScope
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.context.request.RequestAttributes
import java.util.concurrent.atomic.AtomicReference
import javax.servlet.http.HttpSession

@Component
@SessionScope
class SessionAuthentication {
    val user: AtomicReference<User?> = AtomicReference(null)
}

const val SESSION_AUTHENTICATION_KEY = "scopedTarget.sessionAuthentication"

fun NativeWebRequest?.authentication() = this?.getAttribute(SESSION_AUTHENTICATION_KEY, RequestAttributes.SCOPE_SESSION) as? SessionAuthentication
fun NativeWebRequest?.user() = this?.authentication()?.user?.get()

fun HttpSession?.authentication() = this?.getAttribute(SESSION_AUTHENTICATION_KEY) as? SessionAuthentication
fun HttpSession?.user() = this?.authentication()?.user?.get()