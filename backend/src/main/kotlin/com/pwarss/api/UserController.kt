// Created by Konstantin Khvan on 7/9/18 5:22 PM

package com.pwarss.api

import com.pwarss.model.User
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * REST endpoint for login and logout commands
 */
@RestController
@RequestMapping("/api")
class UserController() {

    @GetMapping("/user")
    fun user(user: User): ResponseEntity<User> {
        return ResponseEntity.ok(user)
    }
}
