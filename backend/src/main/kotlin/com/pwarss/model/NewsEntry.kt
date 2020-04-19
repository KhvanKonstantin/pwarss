// Created by Konstantin Khvan on 7/6/18 5:21 PM

package com.pwarss.model

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.sql.Date

/**
 * News entry dto
 */
data class NewsEntry(@JsonSerialize(using = ToStringSerializer::class) val id: Long,
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
