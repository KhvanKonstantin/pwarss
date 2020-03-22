// Created by Konstantin Khvan on 7/10/18 9:09 PM

package com.pwarss.api

import com.fasterxml.jackson.databind.ObjectMapper
import com.pwarss.model.EMPTY_ENTRY
import com.pwarss.testutil.DefaultTestPropertiesSource
import com.pwarss.ttrs.EntriesServiceTtrss
import com.pwarss.ttrs.UserServiceTtrss
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@RunWith(SpringRunner::class)
@DefaultTestPropertiesSource
@SpringBootTest
@AutoConfigureMockMvc
class EntriesControllerTest : MockMvcAuthSupport {
    @Autowired
    override lateinit var mockMvc: MockMvc

    @Autowired
    override lateinit var objectMapper: ObjectMapper

    @MockBean
    override lateinit var userService: UserServiceTtrss

    @MockBean
    lateinit var entriesService: EntriesServiceTtrss

    @Test
    fun checkAccessIsForbiddenWithoutLogin() {
        mockMvc.perform(get("/api/entries/0")).andExpect(status().isForbidden)
        mockMvc.perform(get("/api/entries")).andExpect(status().isForbidden)
        mockMvc.perform(get("/api/entries").param("unread", "true")).andExpect(status().isForbidden)
        mockMvc.perform(get("/api/entries").param("starred", "true")).andExpect(status().isForbidden)
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
                .andExpect(jsonMatcher(EMPTY_ENTRY))
    }

    @Test
    fun findEntries() {
        val (session, user) = doLogin()

        val entries = listOf(EMPTY_ENTRY)
        Mockito.doReturn(entries).`when`(entriesService).findEntries(Mockito.eq(user.id), Mockito.anyInt(), Mockito.any(), Mockito.any())

        mockMvc.perform(get("/api/entries").session(session))
                .andExpect(status().isOk)
                .andExpect(jsonMatcher(entries))
    }

    @Test
    fun findUnread() {
        val (session, user) = doLogin()

        val entries = listOf(EMPTY_ENTRY)
        Mockito.doReturn(entries).`when`(entriesService).findEntries(Mockito.eq(user.id), Mockito.anyInt(), Mockito.eq(true), Mockito.any())

        mockMvc.perform(get("/api/entries").session(session).param("unread", "true"))
                .andExpect(status().isOk)
                .andExpect(jsonMatcher(entries))
    }

    @Test
    fun findStarred() {
        val (session, user) = doLogin()

        val entries = listOf(EMPTY_ENTRY)
        Mockito.doReturn(entries).`when`(entriesService).findEntries(Mockito.eq(user.id), Mockito.anyInt(), Mockito.any(), Mockito.eq(true))

        mockMvc.perform(get("/api/entries").session(session).param("starred", "true"))
                .andExpect(status().isOk)
                .andExpect(jsonMatcher(entries))
    }

    @Test
    fun readAll() {
        val (session, user) = doLogin()

        val ids = listOf(1L, 2L, 3L)

        Mockito.doReturn(true).`when`(entriesService).markRead(user.id, ids)

        mockMvc.perform(post("/api/entries/read").session(session)
                        .jsonContent(EntriesController.ReadAllRequest(ids)))
                .andExpect(status().isOk)
                .andExpect(jsonMatcher(EntriesController.GenericResponse(true)))
    }

    @Test
    fun starEntry() {
        val (session, user) = doLogin()

        val id = 1L
        val star = true

        Mockito.doReturn(true to EMPTY_ENTRY).`when`(entriesService).starEntry(user.id, id, star)

        mockMvc.perform(post("/api/entries/$id/star").session(session)
                        .jsonContent(EntriesController.StarEntryRequest(star)))
                .andExpect(status().isOk)
                .andExpect(jsonMatcher(EntriesController.GenericResponse(true)))
    }

    @Test
    fun readEntry() {
        val (session, user) = doLogin()

        val id = 1L
        val read = true

        Mockito.doReturn(true to EMPTY_ENTRY).`when`(entriesService).readEntry(user.id, id, read)

        mockMvc.perform(post("/api/entries/$id/read").session(session)
                        .jsonContent(EntriesController.ReadEntryRequest(read)))
                .andExpect(status().isOk)
                .andExpect(jsonMatcher(EntriesController.GenericResponse(true)))
    }

}
