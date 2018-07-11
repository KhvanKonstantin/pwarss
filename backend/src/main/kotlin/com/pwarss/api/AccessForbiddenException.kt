// Created by Konstantin Khvan on 7/10/18 1:49 PM

package com.pwarss.api

/**
 * This exception should be thrown when request is not authenticated
 */
class AccessForbiddenException : RuntimeException("FORBIDDEN")