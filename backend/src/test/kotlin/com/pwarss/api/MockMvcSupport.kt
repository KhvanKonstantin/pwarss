// Created by Konstantin Khvan on 8/4/18 3:42 PM

package com.pwarss.api

import com.fasterxml.jackson.databind.ObjectMapper
import com.pwarss.model.User
import com.pwarss.ttrs.UserServiceTtrss
import com.pwarss.ttrs.UserWithHashedPassword
import org.mockito.Mockito
import org.springframework.http.MediaType
import org.springframework.mock.web.MockHttpSession
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

interface MockMvcJsonSupport {
    val objectMapper: ObjectMapper

    fun jsonMatcher(obj: Any) = MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(obj))

    fun MockHttpServletRequestBuilder.jsonContent(obj: Any) = this
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(objectMapper.writeValueAsString(obj))
}

interface MockMvcAuthSupport : MockMvcJsonSupport {
    val mockMvc: MockMvc

    val userService: UserServiceTtrss

    fun doLogin(user: User = User(1, "login"), hash: String = "hash", password: String = "password"): Pair<MockHttpSession, User> {
        val uah = UserWithHashedPassword(user, hash)

        Mockito.doReturn(uah).`when`(userService).checkPassword(user.login, password)
        Mockito.doReturn(true).`when`(userService).checkSessionIsStillValid(user.login, uah.hashedPassword)

        val session = MockHttpSession()

        mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
                .session(session)
                .jsonContent(mapOf("login" to user.login, "password" to password)))
                .andExpect(MockMvcResultMatchers.status().isOk)

        return session to user
    }
}