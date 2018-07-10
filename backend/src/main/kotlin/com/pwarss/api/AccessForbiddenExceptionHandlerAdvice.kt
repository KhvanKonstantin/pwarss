// Created by Konstantin Khvan on 7/10/18 10:47 AM

package com.pwarss.api

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler


@ControllerAdvice
class AccessForbiddenExceptionHandlerAdvice {
    private val responseForbidden = ResponseEntity.status(HttpStatus.FORBIDDEN).body("{\"error\":\"FORBIDDEN\"}")

    @ExceptionHandler(AccessForbiddenException::class)
    fun handleAccessForbiddenException(): ResponseEntity<*> = responseForbidden
}