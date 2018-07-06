// Created by Konstantin Khvan on 7/6/18 6:09 PM

package com.pwarss.ttrs

import com.pwarss.PwarssApplication
import com.pwarss.testutil.DefaultTestPropertiesSource
import com.pwarss.testutil.TestProperties
import org.junit.Assert
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
        ownerId = userService.checkPassword(testProperties.username, testProperties.password)!!.id
    }

    @Test
    fun listLastEntries() {
        val entries = entriesService.listLastEntries(ownerId, 50)

        Assert.assertTrue(entries.isNotEmpty())
    }

    @Test
    fun runAllLists() {
        entriesService.listLastEntries(ownerId, 50)
        entriesService.listLastMarkedEntries(ownerId, 50)
        entriesService.listLastUnreadEntries(ownerId, 50)
    }

    @Test
    fun markEntry() {
        val latestEntry = entriesService.listLastEntries(ownerId, 10).first()

        entriesService.markEntry(ownerId, latestEntry.id, true)
        Assert.assertTrue(entriesService.findEntryById(ownerId, latestEntry.id).marked)

        entriesService.markEntry(ownerId, latestEntry.id, false)
        Assert.assertFalse(entriesService.findEntryById(ownerId, latestEntry.id).marked)
    }

    @Test
    fun markEntryRead() {
        val latestEntry = entriesService.listLastEntries(ownerId, 10).first()

        entriesService.markEntryRead(ownerId, latestEntry.id, true)
        Assert.assertTrue(entriesService.findEntryById(ownerId, latestEntry.id).read)

        entriesService.markEntryRead(ownerId, latestEntry.id, false)
        Assert.assertFalse(entriesService.findEntryById(ownerId, latestEntry.id).read)
    }
}