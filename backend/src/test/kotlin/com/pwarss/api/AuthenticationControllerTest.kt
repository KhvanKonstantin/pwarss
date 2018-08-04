// Created by Konstantin Khvan on 7/9/18 7:18 PM

package com.pwarss.api

import com.fasterxml.jackson.databind.ObjectMapper
import com.pwarss.model.User
import com.pwarss.testutil.DefaultTestPropertiesSource
import com.pwarss.ttrs.UserServiceTtrss
import com.pwarss.ttrs.UserWithHashedPassword
import org.assertj.core.api.Assertions.assertThat
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
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers


@RunWith(SpringRunner::class)
@DefaultTestPropertiesSource
@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationControllerTest : MockMvcAuthSupport {

    @Autowired
    override lateinit var mockMvc: MockMvc

    @Autowired
    override lateinit var objectMapper: ObjectMapper

    @MockBean
    override lateinit var userService: UserServiceTtrss

    @Test
    fun loginFailureEmpty() {
        Mockito.doReturn(null).`when`(userService).checkPassword(Mockito.anyString(), Mockito.anyString())

        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
                .andDo {
                    assertThat(it.request.session?.user()).isNull()
                }

        mockMvc.perform(post("/api/login")
                .jsonContent(mapOf("login" to "", "password" to "")))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andDo {
                    assertThat(it.request.session?.user()).isNull()
                }

        Mockito.verify(userService, times(1)).checkPassword(anyString(), anyString())
    }

    @Test
    fun loginSuccess() {
        val user = User(1, "login")
        val uah = UserWithHashedPassword(user, "hash")

        val password = "password"
        Mockito.doReturn(uah).`when`(userService).checkPassword(user.login, password)

        mockMvc.perform(post("/api/login")
                .jsonContent(mapOf("login" to user.login, "password" to password)))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(jsonMatcher(user))
                .andDo {
                    val userFromSession = it.request.session?.user()
                    assertThat(userFromSession).isEqualTo(user)
                }

        Mockito.verify(userService, times(1)).checkPassword(anyString(), anyString())
    }

    @Test
    fun logout() {
        mockMvc.perform(post("/api/logout"))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andDo {
                    assertThat(it.request.session?.user()).isNull()
                }

        Mockito.verify(userService, never()).checkPassword(anyString(), anyString())
    }

    @Test
    fun user() {
        val (session, user) = doLogin()

        mockMvc.perform(get("/api/user").session(session))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(jsonMatcher(user))
                .andDo {
                    val userFromSession = it.request.session?.user()
                    assertThat(userFromSession).isEqualTo(user)
                }
    }
}