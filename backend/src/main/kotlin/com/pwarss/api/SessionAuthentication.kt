// Created by Konstantin Khvan on 7/9/18 6:06 PM

package com.pwarss.api

import com.pwarss.model.User
import org.springframework.stereotype.Component
import org.springframework.web.context.annotation.SessionScope
import java.util.concurrent.atomic.AtomicReference

@Component
@SessionScope
class SessionAuthentication {
    val user: AtomicReference<User?> = AtomicReference(null)
}