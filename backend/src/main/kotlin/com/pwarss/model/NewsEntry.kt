// Created by Konstantin Khvan on 7/6/18 5:21 PM

package com.pwarss.model

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.sql.Date

/**
 * News entry dto
 */
data class NewsEntry(@JsonSerialize(using = ToStringSerializer::class) val id: Long,
                     val tags: List<String>,
                     val link: String,
                     val title: String,
                     val date: Date,
                     val content: String)

/**
 * Null object for NewsEntry
 */
val EMPTY_ENTRY = NewsEntry(1, emptyList(), "", "", Date(0), "")


val TAG_READ = "read"
val TAG_MARKED = "marked"
