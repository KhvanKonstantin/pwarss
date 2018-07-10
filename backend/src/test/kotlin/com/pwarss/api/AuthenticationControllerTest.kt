// Created by Konstantin Khvan on 7/9/18 7:18 PM

package com.pwarss.api

import com.fasterxml.jackson.databind.ObjectMapper
import com.pwarss.model.User
import com.pwarss.testutil.DefaultTestPropertiesSource
import com.pwarss.ttrs.UserServiceTtrss
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import javax.servlet.http.HttpSession


@RunWith(SpringRunner::class)
@DefaultTestPropertiesSource
@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @MockBean
    lateinit var userService: UserServiceTtrss

    private fun HttpSession?.authentication() = this?.getAttribute("scopedTarget.sessionAuthentication") as? SessionAuthentication
    private fun HttpSession?.user() = this?.authentication()?.user?.get()

    @Test
    fun loginFailureEmpty() {
        Mockito.doReturn(null).`when`(userService).checkPassword(Mockito.anyString(), Mockito.anyString())

        mockMvc.perform(post("/login")
                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
                .andDo {
                    assertThat(it.request.session?.user()).isNull()
                }

        mockMvc.perform(post("/login")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(mapOf("login" to "", "password" to ""))))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)
                .andDo {
                    assertThat(it.request.session?.user()).isNull()
                }

        Mockito.verify(userService, times(1)).checkPassword(anyString(), anyString())
    }

    @Test
    fun loginSuccess() {
        val user = User(1, "login")

        Mockito.doReturn(user).`when`(userService).checkPassword(user.login, "password")

        mockMvc.perform(post("/login")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(mapOf("login" to user.login, "password" to "password"))))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(user)))
                .andDo {
                    val userFromSession = it.request.session?.user()
                    assertThat(userFromSession).isEqualTo(user)
                }

        Mockito.verify(userService, times(1)).checkPassword(anyString(), anyString())
    }

    @Test
    fun logout() {
        mockMvc.perform(post("/logout")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andDo {
                    assertThat(it.request.session?.user()).isNull()
                }

        Mockito.verify(userService, never()).checkPassword(anyString(), anyString())
    }
}