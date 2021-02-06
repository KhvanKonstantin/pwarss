// Created by Konstantin Khvan on 4/23/20, 8:38 AM

package com.pwarss.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.pwarss.model.User
import com.pwarss.ttrs.TtrssAuthenticationProvider
import org.apache.tomcat.util.http.Rfc6265CookieProcessor
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory
import org.springframework.boot.web.server.WebServerFactoryCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod.GET
import org.springframework.http.HttpStatus
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import org.springframework.security.authentication.*
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


@Configuration
@EnableWebSecurity
class WebSecurityConfig(val ttrssAuthenticationProvider: TtrssAuthenticationProvider,
                        val mapperBuilder: Jackson2ObjectMapperBuilder) : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity) {
        http
                .httpBasic().disable()
                .formLogin().disable()

                .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .and()

                .addFilterBefore(
                        authenticationFilter(),
                        UsernamePasswordAuthenticationFilter::class.java)
                .logout()
                .logoutUrl("/api/logout")
                .logoutSuccessHandler { request, response, authentication ->
                    response.status = HttpStatus.OK.value()
                    response.writer.println("{\"logout\":\"ok\"}")
                }

                .and()
                .authorizeRequests()

                .antMatchers("/api/login", "/api/logout").permitAll()
                .antMatchers("/api/user").hasRole("USER")

                .antMatchers("/api/entries/**").hasRole("USER")

                .antMatchers(GET, "/service-worker.js", "/precache-manifest.*.js").permitAll()
                .antMatchers(GET, "/manifest.json", "/asset-manifest.json").permitAll()
                .antMatchers(GET, "/static/**").permitAll()
                .antMatchers(GET, "/favicon.ico").permitAll()
                .antMatchers(GET, "/").permitAll()

                .anyRequest().denyAll()
    }

    @Bean
    fun authenticationFilter(): RequestBodyReaderAuthenticationFilter {
        val mapper = mapperBuilder.build<ObjectMapper>()

        return RequestBodyReaderAuthenticationFilter(mapper).also {

            it.setAuthenticationSuccessHandler { request, response, authentication ->
                response.status = HttpStatus.OK.value()
                val user = authentication?.details as? User
                response.writer.println(mapper.writeValueAsString(User(user?.id ?: 0, user?.login ?: "")))
            }

            it.setAuthenticationFailureHandler { request, response, authentication ->
                response.status = HttpStatus.UNAUTHORIZED.value()
                response.writer.println("{\"error\":\"FORBIDDEN\"}")
            }

            it.setRequiresAuthenticationRequestMatcher(AntPathRequestMatcher("/api/login", "POST"))
            it.setAuthenticationManager(authenticationManagerBean())
        }
    }

    override fun authenticationManager(): AuthenticationManager {
        return ProviderManager(listOf(ttrssAuthenticationProvider));
    }
}

const val MAX_LOGIN_REQUEST_LENGTH = 2048

class RequestBodyReaderAuthenticationFilter(val objectMapper: ObjectMapper) : UsernamePasswordAuthenticationFilter() {
    class LoginRequestFormData(val login: String?, val password: String?)

    override fun attemptAuthentication(request: HttpServletRequest, response: HttpServletResponse): Authentication {

        return try {
            val requestBody = request.reader.readText()

            if (requestBody.length > MAX_LOGIN_REQUEST_LENGTH) {
                throw BadCredentialsException("Login request too big")
            }

            if (requestBody.isEmpty()) {
                throw BadCredentialsException("Login request empty")
            }

            val loginRequest: LoginRequestFormData = objectMapper.readValue(requestBody, LoginRequestFormData::class.java)
            val token = UsernamePasswordAuthenticationToken(loginRequest.login, loginRequest.password)

            setDetails(request, token)

            authenticationManager.authenticate(token)

        } catch (e: BadCredentialsException) {
            throw e
        } catch (e: RuntimeException) {
            throw InternalAuthenticationServiceException("", e)
        }
    }
}


@Configuration
class TomcatConfiguration {
    @Bean
    fun cookieProcessorCustomizer(): WebServerFactoryCustomizer<TomcatServletWebServerFactory> {
        return WebServerFactoryCustomizer { tomcatServletWebServerFactory ->
            tomcatServletWebServerFactory.addContextCustomizers(TomcatContextCustomizer { context ->
                val processor = Rfc6265CookieProcessor()
                processor.setSameSiteCookies("strict")
                context.cookieProcessor = processor
            })
        }
    }
}
