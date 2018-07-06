// Created by Konstantin Khvan on 7/6/18 5:21 PM

package com.pwarss.model

import java.sql.Date

data class NewsEntry(val id: Long,
                     val read: Boolean,
                     val marked: Boolean,
                     val link: String,
                     val title: String,
                     val date: Date,
                     val content: String)