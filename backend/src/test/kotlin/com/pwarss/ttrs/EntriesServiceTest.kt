// Created by Konstantin Khvan on 7/6/18 6:09 PM

package com.pwarss.ttrs

import com.pwarss.PwarssApplication
import com.pwarss.model.NewsEntry
import com.pwarss.model.TAG_MARKED
import com.pwarss.model.TAG_READ
import com.pwarss.testutil.DefaultTestPropertiesSource
import com.pwarss.testutil.TestProperties
import org.assertj.core.api.Assertions.assertThat
import org.junit.Ignore
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner
import javax.annotation.PostConstruct

/**
 * Integration test, requires preexisting user created by tt-rss and non empty entries db
 */
@RunWith(SpringRunner::class)
@SpringBootTest(classes = [PwarssApplication::class])
@DefaultTestPropertiesSource
class EntriesServiceTest {
    @Autowired
    lateinit var userService: UserServiceTtrss

    @Autowired
    lateinit var entriesService: EntriesServiceTtrss

    @Autowired
    lateinit var testProperties: TestProperties

    var ownerId = -1L

    @PostConstruct
    fun init() {
        ownerId = userService.checkPassword(testProperties.username, testProperties.password)!!.user.id
    }

    @Test
    fun findEntries() {
        val entries = entriesService.findEntries(ownerId, 50)

        assertThat(entries.isNotEmpty()).isTrue()
    }

    @Test
    fun runAllFinds() {
        entriesService.findEntries(ownerId, 50)
        entriesService.findEntries(ownerId, 50, marked = true)
        entriesService.findEntries(ownerId, 50, unread = true)
    }

    @Test
    fun starEntry() {
        val latestEntry = entriesService.findEntries(ownerId, 10).first()

        entriesService.starEntry(ownerId, latestEntry.id, true).let { (success, newsEntry) ->
            assertThat(success).isTrue()
            assertThat(newsEntry?.starred).isTrue()
        }

        entriesService.starEntry(ownerId, latestEntry.id, false).let { (success, newsEntry) ->
            assertThat(success).isTrue()
            assertThat(newsEntry?.starred).isFalse()
        }
    }

    @Test
    fun readEntry() {
        val latestEntry = entriesService.findEntries(ownerId, 10).first()

        entriesService.readEntry(ownerId, latestEntry.id, true).let { (success, newsEntry) ->
            assertThat(success).isTrue()
            assertThat(newsEntry?.read).isTrue()
        }

        entriesService.readEntry(ownerId, latestEntry.id, false).let { (success, newsEntry) ->
            assertThat(success).isTrue()
            assertThat(newsEntry?.read).isFalse()
        }
    }

    @Test
    @Ignore("This is destructive test disabled by default")
    fun readSingleEntry() {
        val entries = entriesService.findEntries(ownerId, 10, unread = true)
        val latestEntry = entries.first()

        entriesService.readEntry(ownerId, latestEntry.id, true)
        assertThat(entriesService.findEntryById(ownerId, latestEntry.id)?.read).isTrue()
    }

    @Test
    @Ignore("This is destructive test disabled by default")
    fun readAll() {
        val entries = entriesService.findEntries(ownerId, 10, unread = true)

        entriesService.markRead(ownerId, entries.map { it.id })

        val updatedEntries = entries.map { entriesService.findEntryById(ownerId, it.id)!! }
        val allUnread = updatedEntries.all { it.read }
        assertThat(allUnread).isTrue()
    }
}


private val NewsEntry.read
    get() = this.tags.contains(TAG_READ)

private val NewsEntry.starred
    get() = this.tags.contains(TAG_MARKED)
