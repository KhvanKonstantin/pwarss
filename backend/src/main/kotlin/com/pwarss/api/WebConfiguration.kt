// Created by Konstantin Khvan on 7/10/18 9:16 PM

package com.pwarss.api

import org.springframework.context.annotation.Configuration
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfiguration : WebMvcConfigurer {
    override fun addArgumentResolvers(resolvers: MutableList<HandlerMethodArgumentResolver>?) {
        resolvers?.add(UserArgumentResolver())
    }
}