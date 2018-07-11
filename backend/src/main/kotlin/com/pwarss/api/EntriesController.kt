// Created by Konstantin Khvan on 7/10/18 10:39 AM

package com.pwarss.api

import com.pwarss.model.NewsEntry
import com.pwarss.model.User
import com.pwarss.ttrs.EntriesServiceTtrss
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

/**
 * REST controller for NewsEntry query and update commands
 */
@RestController
class EntriesController(private val entriesService: EntriesServiceTtrss) {

    @GetMapping("/entries/{id}")
    fun findById(@PathVariable("id") id: Long, user: User): ResponseEntity<*> {
        val entry = entriesService.findEntryById(user.id, id)
        return when (entry) {
            null -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
            else -> ResponseEntity.ok(entry)
        }
    }

    @GetMapping("/entries")
    fun findEntries(user: User): ResponseEntity<List<NewsEntry>> {
        val entries = entriesService.findEntries(user.id, 500)
        return ResponseEntity.ok(entries)
    }

    @GetMapping("/unread")
    fun findUnread(user: User): ResponseEntity<List<NewsEntry>> {
        val entries = entriesService.findUnread(user.id, 500)
        return ResponseEntity.ok(entries)
    }

    @GetMapping("/marked")
    fun findMarked(user: User): ResponseEntity<List<NewsEntry>> {
        val entries = entriesService.findMarked(user.id, 500)
        return ResponseEntity.ok(entries)
    }
}