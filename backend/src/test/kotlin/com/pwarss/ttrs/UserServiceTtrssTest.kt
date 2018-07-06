// Created by Konstantin Khvan on 7/6/18 2:39 PM

package com.pwarss.ttrs

import com.pwarss.PwarssApplication
import org.junit.Assert
import org.junit.Ignore
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest(classes = [PwarssApplication::class])
internal class UserServiceTtrssTest {

    @Autowired
    lateinit var ttrss: UserServiceTtrss

    @Ignore("Integration test, requires preexisting user created by tt-rss")
    @Test
    fun checkPassword() {
        Assert.assertFalse(ttrss.checkPassword("", ""))

        Assert.assertTrue(ttrss.checkPassword("ExistingUserCreatedByTt-rss", "pswd"))
    }
}