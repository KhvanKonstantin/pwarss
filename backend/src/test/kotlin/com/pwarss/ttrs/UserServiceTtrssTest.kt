// Created by Konstantin Khvan on 7/6/18 2:39 PM

package com.pwarss.ttrs

import com.pwarss.PwarssApplication
import com.pwarss.testutil.DefaultTestPropertiesSource
import com.pwarss.testutil.TestProperties
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner

/**
 * Integration test, requires preexisting user created by tt-rss
 */
@RunWith(SpringRunner::class)
@SpringBootTest(classes = [PwarssApplication::class])
@DefaultTestPropertiesSource
internal class UserServiceTtrssTest {

    @Autowired
    lateinit var userService: UserServiceTtrss

    @Autowired
    lateinit var props: TestProperties

    @Test
    fun checkPassword() {
        assertThat(userService.checkPassword("", "")).isNull()

        assertThat(userService.checkPassword(props.username, props.password)).isNotNull()
    }


    @Test
    fun checkSessionIsStillValid() {
        val uah = userService.checkPassword(props.username, props.password)

        assertThat(uah).isNotNull()

        assertThat(userService.checkSessionIsStillValid(props.username, uah!!.hashedPassword)).isTrue()

        assertThat(userService.checkSessionIsStillValid("", uah!!.hashedPassword)).isFalse()

        assertThat(userService.checkSessionIsStillValid(props.username, "")).isFalse()
    }
}