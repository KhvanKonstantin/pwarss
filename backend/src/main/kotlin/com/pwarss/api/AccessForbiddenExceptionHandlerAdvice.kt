// Created by Konstantin Khvan on 7/10/18 10:47 AM

package com.pwarss.api

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler


val RESPONSE_FORBIDDEN: ResponseEntity<String> = ResponseEntity.status(HttpStatus.FORBIDDEN).body("{\"error\":\"FORBIDDEN\"}")

/**
 * Global controller handler for AccessForbiddenException that returns generic json error with HTTP 403 code
 */
@ControllerAdvice
class AccessForbiddenExceptionHandlerAdvice {

    @ExceptionHandler(AccessForbiddenException::class)
    fun handleAccessForbiddenException(): ResponseEntity<*> = RESPONSE_FORBIDDEN
}