// Created by Konstantin Khvan on 7/6/18 3:53 PM

package com.pwarss.ttrs

import com.pwarss.PwaRssProperties
import com.pwarss.model.NewsEntry
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.sql.Types

/**
 * tt-rss db based entries repository
 */
@Service
class EntriesServiceTtrss(private val jdbcTemplate: NamedParameterJdbcTemplate, config: PwaRssProperties) {

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
        return findEntriesImpl(ownerId, 1, entryId = entryId).firstOrNull()
    }

    fun findEntries(ownerId: Long, limit: Int, unread: Boolean? = null, marked: Boolean? = null): List<NewsEntry> {
        return findEntriesImpl(ownerId, limit, unread = unread, marked = marked)
    }

    @Transactional
    fun starEntry(ownerId: Long, entryId: Long, star: Boolean): Pair<Boolean, NewsEntry?> {
        val query = """UPDATE ttrss_user_entries
                       SET marked = :marked
                       WHERE owner_uid = :ownerId
                         AND ref_id = :refId"""

        val args = mutableMapOf("ownerId" to ownerId, "refId" to entryId,
                "marked" to star)
        val success = jdbcTemplate.update(query, args) > 0
        val entry = findEntryById(ownerId, entryId)

        return success to entry
    }

    @Transactional
    fun readEntry(ownerId: Long, entryId: Long, read: Boolean): Pair<Boolean, NewsEntry?> {
        val query = """UPDATE ttrss_user_entries
                       SET unread = :unread
                       WHERE owner_uid = :ownerId
                         AND ref_id = :refId"""

        val args = mutableMapOf("ownerId" to ownerId, "refId" to entryId,
                "unread" to !read)

        val success = jdbcTemplate.update(query, args) > 0
        val entry = findEntryById(ownerId, entryId)

        return success to entry
    }

    fun markRead(ownerId: Long, ids: List<Long>): Boolean {
        val query = """UPDATE ttrss_user_entries
                       SET unread = FALSE
                       WHERE owner_uid = :ownerId
                         AND ref_id IN (:ids)"""

        var success = false

        ids.chunked(50).forEach { idsChunk ->
            val args = mutableMapOf("ownerId" to ownerId, "ids" to idsChunk)
            val updated = jdbcTemplate.update(query, args) > 0

            success = success && updated
        }

        return success
    }

    @Suppress("NULLABILITY_MISMATCH_BASED_ON_JAVA_ANNOTATIONS")
    fun findEntriesImpl(ownerId: Long, limit: Int, entryId: Long? = null,
                        minId: Long? = null, maxId: Long? = null,
                        unread: Boolean? = null, marked: Boolean? = null): List<NewsEntry> {

        val args = MapSqlParameterSource().apply {
            addValue("ownerId", ownerId, Types.INTEGER)
            addValue("limit", limit.coerceIn(10, maxEntries), Types.INTEGER)
            addValue("unread", unread, Types.BOOLEAN)
            addValue("marked", marked, Types.BOOLEAN)
            addValue("minId", minId, Types.INTEGER)
            addValue("maxId", maxId, Types.INTEGER)
            addValue("refId", entryId, Types.INTEGER)
        }

        val query = """SELECT e.id           AS id,
                              ue.unread      AS unread,
                              ue.marked      AS marked,
                              e.link         AS link,
                              e.title        AS title,
                              e.date_entered AS date,
                              e.content      AS content
                       FROM ttrss_user_entries AS ue
                           JOIN ttrss_entries AS e ON ue.ref_id = e.id
                       WHERE ue.owner_uid = :ownerId
                           AND (:refId IS NULL OR ue.ref_id = :refId)
                           AND (:unread IS NULL OR ue.unread = :unread)
                           AND (:marked IS NULL OR ue.marked = :marked)
                           AND (:minId IS NULL OR e.id > :minId)
                           AND (:maxId IS NULL OR e.id < :maxId)
                       ORDER BY id DESC, date_entered DESC
                       LIMIT :limit"""

        return jdbcTemplate.query(query, args, newsEntryMapper)
    }
}
