// Created by Konstantin Khvan on 7/10/18 10:39 AM

package com.pwarss.api

import com.pwarss.model.NewsEntry
import com.pwarss.model.User
import com.pwarss.ttrs.EntriesServiceTtrss
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST controller for NewsEntry query and update commands
 */
@RestController()
@RequestMapping("/api")
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
    fun findEntries(@RequestParam("limit", required = false, defaultValue = "500") limit: Int, user: User): ResponseEntity<List<NewsEntry>> {
        val entries = entriesService.findEntries(user.id, limit)
        return ResponseEntity.ok(entries)
    }

    @GetMapping("/unread")
    fun findUnread(@RequestParam("limit", required = false, defaultValue = "500") limit: Int, user: User): ResponseEntity<List<NewsEntry>> {
        val entries = entriesService.findUnread(user.id, limit)
        return ResponseEntity.ok(entries)
    }

    @GetMapping("/marked")
    fun findMarked(@RequestParam("limit", required = false, defaultValue = "500") limit: Int, user: User): ResponseEntity<List<NewsEntry>> {
        val entries = entriesService.findMarked(user.id, limit)
        return ResponseEntity.ok(entries)
    }

    class ReadAllRequest(val maxId: Long?)

    @PostMapping("/unread/readAll")
    fun readAll(@RequestBody req: ReadAllRequest, user: User): ResponseEntity<GenericResponse> {
        val maxId = req.maxId ?: throw IllegalArgumentException()
        val anyUpdatedRows = entriesService.readAll(user.id, maxId)
        return ResponseEntity.ok(GenericResponse(anyUpdatedRows))
    }

    class GenericResponse(val success: Boolean)

    class MarkEntryRequest(val mark: Boolean?)

    @PostMapping("/entries/{id}/mark", consumes = [MediaType.APPLICATION_JSON_UTF8_VALUE], produces = [MediaType.APPLICATION_JSON_UTF8_VALUE])
    fun markEntry(@PathVariable("id") id: Long, @RequestBody form: MarkEntryRequest, user: User): ResponseEntity<GenericResponse> {
        val success = entriesService.markEntry(user.id, id, form.mark ?: true)
        return ResponseEntity.ok(GenericResponse(success))
    }

    class MarkEntryReadFormData(val read: Boolean?)

    @PostMapping("/entries/{id}/read", consumes = [MediaType.APPLICATION_JSON_UTF8_VALUE], produces = [MediaType.APPLICATION_JSON_UTF8_VALUE])
    fun markEntryRead(@PathVariable("id") id: Long, @RequestBody form: MarkEntryReadFormData, user: User): ResponseEntity<GenericResponse> {
        val success = entriesService.markEntryRead(user.id, id, form.read ?: true)
        return ResponseEntity.ok(GenericResponse(success))
    }
}