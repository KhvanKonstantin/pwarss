// Created by Konstantin Khvan on 7/9/18 2:47 PM

package com.pwarss

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

/**
 * Definition of application preferences
 *
 * Set them in /config/application.properties
 */
@Component
@ConfigurationProperties("pwarss")
class PwaRssProperties {
    var maxEntriesForRequest = 500
}