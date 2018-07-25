// Created by Konstantin Khvan on 7/10/18 9:09 PM

package com.pwarss.api

import com.fasterxml.jackson.databind.ObjectMapper
import com.pwarss.model.EMPTY_ENTRY
import com.pwarss.model.User
import com.pwarss.testutil.DefaultTestPropertiesSource
import com.pwarss.ttrs.EntriesServiceTtrss
import com.pwarss.ttrs.UserServiceTtrss
import com.pwarss.ttrs.UserWithHashedPassword
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.mock.web.MockHttpSession
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@RunWith(SpringRunner::class)
@DefaultTestPropertiesSource
@SpringBootTest
@AutoConfigureMockMvc
class EntriesControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @MockBean
    lateinit var userService: UserServiceTtrss

    @MockBean
    lateinit var entriesService: EntriesServiceTtrss


    private fun doLogin(): Pair<MockHttpSession, User> {
        val user = User(1, "login")
        val uah = UserWithHashedPassword(user, "hash")
        val password = "password"

        Mockito.doReturn(uah).`when`(userService).checkPassword(user.login, password)
        Mockito.doReturn(true).`when`(userService).checkSessionIsStillValid(user.login, uah.hashedPassword)

        val session = MockHttpSession()

        mockMvc.perform(post("/api/login")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(mapOf("login" to user.login, "password" to password))))
                .andExpect(status().isOk)

        return session to user
    }

    @Test
    fun checkAccessIsForbiddenWithoutLogin() {
        mockMvc.perform(get("/api/entries/0")).andExpect(status().isForbidden)
        mockMvc.perform(get("/api/entries")).andExpect(status().isForbidden)
        mockMvc.perform(get("/api/unread")).andExpect(status().isForbidden)
        mockMvc.perform(get("/api/marked")).andExpect(status().isForbidden)
    }

    @Test
    fun findEntryById() {
        val (session, user) = doLogin()

        Mockito.doReturn(null).`when`(entriesService).findEntryById(user.id, 0)
        Mockito.doReturn(EMPTY_ENTRY).`when`(entriesService).findEntryById(user.id, 1)

        mockMvc.perform(get("/api/entries/0").session(session))
                .andExpect(status().isNotFound)

        mockMvc.perform(get("/api/entries/1").session(session))
                .andExpect(status().isOk)
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(EMPTY_ENTRY)))
    }

    @Test
    fun findEntries() {
        val (session, user) = doLogin()

        val entries = listOf(EMPTY_ENTRY)
        Mockito.doReturn(entries).`when`(entriesService).findEntries(Mockito.eq(user.id), Mockito.anyInt())

        mockMvc.perform(get("/api/entries").session(session))
                .andExpect(status().isOk)
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(entries)))
    }

    @Test
    fun findUnread() {
        val (session, user) = doLogin()

        val entries = listOf(EMPTY_ENTRY)
        Mockito.doReturn(entries).`when`(entriesService).findUnread(Mockito.eq(user.id), Mockito.anyInt())

        mockMvc.perform(get("/api/unread").session(session))
                .andExpect(status().isOk)
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(entries)))
    }

    @Test
    fun findMarked() {
        val (session, user) = doLogin()

        val entries = listOf(EMPTY_ENTRY)
        Mockito.doReturn(entries).`when`(entriesService).findMarked(Mockito.eq(user.id), Mockito.anyInt())

        mockMvc.perform(get("/api/marked").session(session))
                .andExpect(status().isOk)
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(entries)))
    }
}