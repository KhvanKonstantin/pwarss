// Created by Konstantin Khvan on 7/6/18 6:33 PM

// Created by Konstantin Khvan on 7/6/18 6:33 PM

// Created by Konstantin Khvan on 7/6/18 5:49 PM

package com.pwarss.testutil

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

/**
 * Definition of additional test properties
 *
 * @see DefaultTestPropertiesSource
 */
@Component
@ConfigurationProperties("pwarsstest")
class TestProperties {
    var username = ""
    var password = ""
}