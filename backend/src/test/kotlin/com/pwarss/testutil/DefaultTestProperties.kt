// Created by Konstantin Khvan on 7/6/18 6:33 PM

// Created by Konstantin Khvan on 7/6/18 6:06 PM

package com.pwarss.testutil

import org.springframework.test.context.TestPropertySource

/**
 * Common annotation for additional properties file to be used in tests specifically
 *
 * Encapsulates actual path to properties file
 */
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.CLASS)
@TestPropertySource(locations = ["file:./src/test/config/test.properties"])
annotation class DefaultTestPropertiesSource