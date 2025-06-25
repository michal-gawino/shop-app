package com.example.shop_app.config;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.authorization.client.AuthzClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import java.io.FileInputStream;
import java.io.FileNotFoundException;

@Configuration
public class KeycloakConfig {

    @Bean
    public AuthzClient authzClient() throws FileNotFoundException {
        return AuthzClient.create(new FileInputStream("keycloak.json"));
    }

    @Bean
    public Keycloak keycloakAdmin() {
        return Keycloak.getInstance("http://localhost:8080", "shop-realm", "michal", "michal", "admin-cli");
    }

    @Bean
    public RestClient restClient(){
        return RestClient.create();
    }
}
