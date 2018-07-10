// Created by Konstantin Khvan on 7/9/18 5:22 PM

package com.pwarss.api

import com.pwarss.ttrs.UserServiceTtrss
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthenticationController(val userService: UserServiceTtrss, val authentication: SessionAuthentication) {

    class LoginRequestFormData(val login: String?, val password: String?)

    @PostMapping("/login", consumes = [MediaType.APPLICATION_JSON_UTF8_VALUE], produces = [MediaType.APPLICATION_JSON_UTF8_VALUE])
    fun login(@RequestBody loginRequest: LoginRequestFormData): ResponseEntity<Any> {
        val user = userService.checkPassword(loginRequest.login, loginRequest.password)

        return when (user) {
            null -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\":\"UNAUTHORIZED\"}")
            else -> {
                authentication.user.set(user)
                ResponseEntity.ok(user)
            }
        }
    }

    @PostMapping("/logout")
    fun logout(): ResponseEntity<String> {
        authentication.user.set(null)
        return ResponseEntity.ok("logout")
    }
}