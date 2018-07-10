// Created by Konstantin Khvan on 7/10/18 9:03 PM

package com.pwarss.api

import com.pwarss.model.User
import org.springframework.core.MethodParameter
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer


class UserArgumentResolver : HandlerMethodArgumentResolver {
    override fun supportsParameter(parameter: MethodParameter?) = User::class.java == parameter?.parameterType

    override fun resolveArgument(parameter: MethodParameter?,
                                 mavContainer: ModelAndViewContainer?,
                                 webRequest: NativeWebRequest?,
                                 binderFactory: WebDataBinderFactory?): Any {
        return webRequest?.user() ?: throw AccessForbiddenException()
    }
}