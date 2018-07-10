// Created by Konstantin Khvan on 7/9/18 2:47 PM

package com.pwarss

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties("pwarss")
class PwaRssConfiguration {
    var maxEntriesForRequest = 500
}