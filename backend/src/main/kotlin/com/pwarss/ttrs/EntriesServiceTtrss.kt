// Created by Konstantin Khvan on 7/6/18 3:53 PM

package com.pwarss.ttrs

import com.pwarss.PwaRssProperties
import com.pwarss.model.NewsEntry
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

/**
 * tt-rss db based entries repository
 */
@Service
class EntriesServiceTtrss(private val jdbcTemplate: JdbcTemplate, config: PwaRssProperties) {

    val maxEntries = config.maxEntriesForRequest

    private val newsEntryMapper = RowMapper { rs, _ ->
        NewsEntry(rs.getLong("id"),
                !rs.getBoolean("unread"),
                rs.getBoolean("marked"),
                rs.getString("link"),
                rs.getString("title"),
                rs.getDate("date"),
                rs.getString("content"))
    }

    fun findEntryById(ownerId: Long, entryId: Long): NewsEntry? {
        val query = """SELECT e.id           AS id,
                              ue.unread      AS unread,
                              ue.marked      AS marked,
                              e.link         AS link,
                              e.title        AS title,
                              e.date_entered AS date,
                              e.content      AS content
                       FROM ttrss_user_entries AS ue
                              JOIN ttrss_entries AS e ON ue.ref_id = e.id
                       WHERE ue.owner_uid = ?
                         AND ue.ref_id = ?"""

        return jdbcTemplate.queryForObject(query, newsEntryMapper, ownerId, entryId)
    }

    fun findEntries(ownerId: Long, limit: Int): List<NewsEntry> {
        val limit = limit.coerceIn(10, maxEntries)

        val query = """SELECT e.id           AS id,
                              ue.unread      AS unread,
                              ue.marked      AS marked,
                              e.link         AS link,
                              e.title        AS title,
                              e.date_entered AS date,
                              e.content      AS content
                       FROM ttrss_user_entries AS ue
                              JOIN ttrss_entries AS e ON ue.ref_id = e.id
                       WHERE ue.owner_uid = ?
                       ORDER BY date_entered DESC, id DESC
                       LIMIT ?"""

        return jdbcTemplate.query(query, newsEntryMapper, ownerId, limit)
    }

    fun findUnread(ownerId: Long, limit: Int): List<NewsEntry> {
        val limit = limit.coerceIn(10, maxEntries)

        val query = """SELECT e.id           AS id,
                              ue.unread      AS unread,
                              ue.marked      AS marked,
                              e.link         AS link,
                              e.title        AS title,
                              e.date_entered AS date,
                              e.content      AS content
                       FROM ttrss_user_entries AS ue
                              JOIN ttrss_entries AS e ON ue.ref_id = e.id
                       WHERE ue.owner_uid = ?
                         AND ue.unread = TRUE
                       ORDER BY date_entered DESC, id DESC
                       LIMIT ?"""

        return jdbcTemplate.query(query, newsEntryMapper, ownerId, limit)
    }

    fun findMarked(ownerId: Long, limit: Int): List<NewsEntry> {
        val limit = limit.coerceIn(10, maxEntries)

        val query = """SELECT e.id           AS id,
                              ue.unread      AS unread,
                              ue.marked      AS marked,
                              e.link         AS link,
                              e.title        AS title,
                              e.date_entered AS date,
                              e.content      AS content
                       FROM ttrss_user_entries AS ue
                              JOIN ttrss_entries AS e ON ue.ref_id = e.id
                       WHERE ue.owner_uid = ?
                         AND ue.marked = TRUE
                       ORDER BY date_entered DESC, id DESC
                       LIMIT ?"""

        return jdbcTemplate.query(query, newsEntryMapper, ownerId, limit)
    }

    fun markEntry(ownerId: Long, entryId: Long, mark: Boolean): Boolean {
        val query = """UPDATE ttrss_user_entries
                       SET marked = ?
                       WHERE owner_uid = ?
                         AND ref_id = ?"""

        return jdbcTemplate.update(query, mark, ownerId, entryId) > 0
    }

    fun markEntryRead(ownerId: Long, entryId: Long, read: Boolean): Boolean {
        val query = """UPDATE ttrss_user_entries
                       SET unread = ?
                       WHERE owner_uid = ?
                         AND ref_id = ?"""

        return jdbcTemplate.update(query, !read, ownerId, entryId) > 0
    }
}