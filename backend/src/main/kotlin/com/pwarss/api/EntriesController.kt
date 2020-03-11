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

    class StarEntryRequest(val star: Boolean?)
    class ReadEntryRequest(val read: Boolean?)
    class ReadAllRequest(val maxId: Long?)
    class GenericResponse(val success: Boolean)
    class GenericResponseWithEntry(val success: Boolean, val entry: NewsEntry?)

    @GetMapping("/entries")
    fun entries(@RequestParam("limit", required = false, defaultValue = "500") limit: Int,
                @RequestParam("unread", required = false) unread: Boolean?,
                @RequestParam("starred", required = false) starred: Boolean?,
                user: User): ResponseEntity<List<NewsEntry>> {
        val entries = entriesService.findEntries(user.id, limit, unread, marked = starred)

        return ResponseEntity.ok(entries)
    }

    @PostMapping("/entries/read")
    fun readAll(@RequestBody req: ReadAllRequest, user: User): ResponseEntity<GenericResponse> {
        val maxId = req.maxId ?: throw IllegalArgumentException()
        val anyUpdatedRows = entriesService.readAll(user.id, maxId)
        return ResponseEntity.ok(GenericResponse(anyUpdatedRows))
    }

    @GetMapping("/entries/{id}")
    fun findById(@PathVariable("id") id: Long, user: User): ResponseEntity<NewsEntry> {
        val entry = entriesService.findEntryById(user.id, id)
        return when (entry) {
            null -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
            else -> ResponseEntity.ok(entry)
        }
    }

    @PostMapping("/entries/{id}/star", consumes = [MediaType.APPLICATION_JSON_UTF8_VALUE], produces = [MediaType.APPLICATION_JSON_UTF8_VALUE])
    fun starEntry(@PathVariable("id") id: Long, @RequestBody form: StarEntryRequest, user: User): ResponseEntity<GenericResponseWithEntry> {
        val (success, entry) = entriesService.starEntry(user.id, id, form.star ?: true)
        return ResponseEntity.ok(GenericResponseWithEntry(success, entry))
    }


    @PostMapping("/entries/{id}/read", consumes = [MediaType.APPLICATION_JSON_UTF8_VALUE], produces = [MediaType.APPLICATION_JSON_UTF8_VALUE])
    fun readEntry(@PathVariable("id") id: Long, @RequestBody form: ReadEntryRequest, user: User): ResponseEntity<GenericResponseWithEntry> {
        val (success, entry) = entriesService.readEntry(user.id, id, form.read ?: true)
        return ResponseEntity.ok(GenericResponseWithEntry(success, entry))
    }
}
