// Created by Konstantin Khvan on 7/9/18 7:18 PM

package com.pwarss.api

import com.fasterxml.jackson.databind.ObjectMapper
import com.pwarss.model.User
import com.pwarss.testutil.DefaultTestPropertiesSource
import com.pwarss.ttrs.UserServiceTtrss
import com.pwarss.ttrs.UserWithHashedPassword
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mockito
import org.mockito.Mockito.never
import org.mockito.Mockito.times
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext


@RunWith(SpringRunner::class)
@DefaultTestPropertiesSource
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class AuthenticationControllerTest : MockMvcAuthSupport {
    @Autowired
    override lateinit var objectMapper: ObjectMapper

    @MockBean
    override lateinit var userService: UserServiceTtrss

    @Autowired
    private lateinit var context: WebApplicationContext

    override lateinit var mockMvc: MockMvc

    @Before
    fun setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply<DefaultMockMvcBuilder>(springSecurity())
                .build()
    }


    @Test
    fun loginFailureEmpty() {
        Mockito.doReturn(null).`when`(userService).checkPassword(Mockito.anyString(), Mockito.anyString())

        mockMvc.perform(post("/api/login")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)

        mockMvc.perform(post("/api/login")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .jsonContent(mapOf("login" to "", "password" to "")))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)

        Mockito.verify(userService, times(1)).checkPassword(anyString(), anyString())
    }

    @Test
    fun loginSuccess() {
        val user = User(1, "login")
        val uah = UserWithHashedPassword(user, "hash")

        val password = "password"
        Mockito.doReturn(uah).`when`(userService).checkPassword(user.login, password)

        mockMvc.perform(post("/api/login")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .jsonContent(mapOf("login" to user.login, "password" to password)))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(jsonMatcher(user))

        Mockito.verify(userService, times(1)).checkPassword(anyString(), anyString())
    }

    @Test
    fun logout() {
        mockMvc.perform(post("/api/logout")
                .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk)


        Mockito.verify(userService, never()).checkPassword(anyString(), anyString())
    }

    @Test
    fun user() {
        val (session, user) = doLogin()

        mockMvc.perform(get("/api/user")
                .with(SecurityMockMvcRequestPostProcessors.csrf()).session(session))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(jsonMatcher(user))
    }
}
