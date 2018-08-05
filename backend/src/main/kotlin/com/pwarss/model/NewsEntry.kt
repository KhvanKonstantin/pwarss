// Created by Konstantin Khvan on 7/6/18 5:21 PM

package com.pwarss.model

import java.sql.Date

/**
 * News entry dto
 */
data class NewsEntry(val id: Long,
                     val read: Boolean,
                     val starred: Boolean,
                     val link: String,
                     val title: String,
                     val date: Date,
                     val content: String)

/**
 * Null object for NewsEntry
 */
val EMPTY_ENTRY = NewsEntry(1, true, false, "", "", Date(0), "")