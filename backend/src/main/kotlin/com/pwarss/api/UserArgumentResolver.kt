// Created by Konstantin Khvan on 7/10/18 9:03 PM

package com.pwarss.api

import com.pwarss.model.User
import com.pwarss.ttrs.UserServiceTtrss
import org.springframework.core.MethodParameter
import org.springframework.stereotype.Component
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer

/**
 * Helper class resolving arguments of type User in spring controllers methods
 *
 * Requires SessionAuthentication to contain User object which indicates successful login
 *
 * From time to time checks DB if user still exists and password was not changed
 */
@Component
class UserArgumentResolver(val userService: UserServiceTtrss, val authentication: SessionAuthentication) : HandlerMethodArgumentResolver {

    val userStillExistsCheckInterval = 10L

    override fun supportsParameter(parameter: MethodParameter?) = User::class.java == parameter?.parameterType

    override fun resolveArgument(parameter: MethodParameter?,
                                 mavContainer: ModelAndViewContainer?,
                                 webRequest: NativeWebRequest?,
                                 binderFactory: WebDataBinderFactory?): Any {
        val uah = authentication.user.get() ?: throw AccessForbiddenException()

        if (authentication.userStillExistsCounterNext % userStillExistsCheckInterval == 0L) {
            if (!userService.checkSessionIsStillValid(uah.user.login, uah.hashedPassword)) {
                authentication.logout()
            }
        }

        return uah.user
    }
}