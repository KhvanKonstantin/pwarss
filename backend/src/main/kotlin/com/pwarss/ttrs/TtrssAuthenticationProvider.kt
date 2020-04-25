// Created by Konstantin Khvan on 4/24/20, 11:21 PM

package com.pwarss.ttrs

import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Service


@Service
class TtrssAuthenticationProvider(val userService: UserServiceTtrss) : AuthenticationProvider {
    override fun authenticate(authentication: Authentication?): Authentication {
        val username = authentication?.principal.toString()
        val password = authentication?.credentials.toString()

        val userWithHashedPassword = userService.checkPassword(username, password)

        if (userWithHashedPassword == null) {
            throw BadCredentialsException("Invalid login or password")
        }

        val token = UsernamePasswordAuthenticationToken(username, null, listOf(SimpleGrantedAuthority("ROLE_USER")))
        token.details = userWithHashedPassword.user
        return token
    }

    override fun supports(authentication: Class<*>?): Boolean {
        return true
    }
}

