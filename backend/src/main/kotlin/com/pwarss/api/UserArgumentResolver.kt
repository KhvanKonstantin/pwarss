// Created by Konstantin Khvan on 7/10/18 9:03 PM

package com.pwarss.api

import com.pwarss.model.User
import org.springframework.core.MethodParameter
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer

/**
 * Helper class resolving arguments of type User in spring controllers methods
 *
 */
@Component
class UserArgumentResolver() : HandlerMethodArgumentResolver {

    override fun supportsParameter(parameter: MethodParameter?) = User::class.java == parameter?.parameterType

    override fun resolveArgument(parameter: MethodParameter?,
                                 mavContainer: ModelAndViewContainer?,
                                 webRequest: NativeWebRequest?,
                                 binderFactory: WebDataBinderFactory?): Any {

        val details: User? = SecurityContextHolder.getContext().authentication.details as? User

        return details ?: throw AccessDeniedException("Access denied")
    }
}
