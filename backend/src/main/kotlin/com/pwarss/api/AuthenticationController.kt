// Created by Konstantin Khvan on 7/9/18 5:22 PM

package com.pwarss.api

import com.pwarss.model.User
import com.pwarss.ttrs.UserServiceTtrss
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST endpoint for login and logout commands
 */
@RestController
@RequestMapping("/api")
class AuthenticationController(val userService: UserServiceTtrss, val authentication: SessionAuthentication) {

    class LoginRequestFormData(val login: String?, val password: String?)

    @GetMapping("/user")
    fun user(user: User): ResponseEntity<User> {
        return ResponseEntity.ok(user)
    }

    @PostMapping("/login", consumes = [MediaType.APPLICATION_JSON_UTF8_VALUE], produces = [MediaType.APPLICATION_JSON_UTF8_VALUE])
    fun login(@RequestBody loginRequest: LoginRequestFormData): ResponseEntity<*> {
        val user = userService.checkPassword(loginRequest.login, loginRequest.password)

        return when (user) {
            null -> RESPONSE_FORBIDDEN
            else -> {
                authentication.user.set(user)
                ResponseEntity.ok(user)
            }
        }
    }

    @PostMapping("/logout")
    fun logout(): ResponseEntity<String> {
        authentication.user.set(null)
        return ResponseEntity.ok("{\"logout\":\"ok\"}")
    }
}