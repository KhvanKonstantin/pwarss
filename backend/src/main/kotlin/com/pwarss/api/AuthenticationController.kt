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

    @PostMapping("/login", consumes = [MediaType.APPLICATION_JSON_VALUE], produces = [MediaType.APPLICATION_JSON_VALUE])
    fun login(@RequestBody loginRequest: LoginRequestFormData): ResponseEntity<User> {
        val uah = userService.checkPassword(loginRequest.login, loginRequest.password)

        return when (uah) {
            null -> throw AccessForbiddenException()
            else -> {
                authentication.login(uah)
                ResponseEntity.ok(uah.user)
            }
        }
    }

    @PostMapping("/logout")
    fun logout(): ResponseEntity<String> {
        authentication.logout()
        return ResponseEntity.ok("{\"logout\":\"ok\"}")
    }
}
