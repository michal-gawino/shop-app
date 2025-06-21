package com.example.shop_app.security;

import com.example.shop_app.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.authorization.client.AuthzClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.List;

import static com.example.shop_app.service.AuthService.TOKEN_COOKIE;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private AuthService authService;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(requests -> {
                    requests.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                            .requestMatchers("/auth/**").permitAll()
                            .requestMatchers("/").authenticated();
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .oauth2ResourceServer((oAuth2ResourceServerConfigurer) -> {
                    oAuth2ResourceServerConfigurer.bearerTokenResolver(bearerTokenResolver());
                    oAuth2ResourceServerConfigurer.jwt(jwt -> {
                                jwt.jwtAuthenticationConverter(jwtAuthenticationConverter());
                            }
                    ).authenticationEntryPoint((request, response, ex) -> {
                        if (ex != null) {
                        }

                    });
                });


        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("roles");
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        converter.setPrincipalClaimName("name");
        return converter;
    }

    @Bean
    public AuthzClient authzClient() throws FileNotFoundException {
        return AuthzClient.create(new FileInputStream("keycloak.json"));
    }

    @Bean
    public Keycloak keycloakAdmin() {
        return Keycloak.getInstance("http://localhost:8080", "shop-realm", "michal", "michal", "admin-cli");
    }

    @Bean
    public BearerTokenResolver bearerTokenResolver() {
        return request -> authService.getCookie(request, TOKEN_COOKIE);
    }

    @Bean
    UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Access-Control-Allow-Origin", "Access-Control-Request-Headers", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
