package com.example.shop_app.config;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.authorization.client.AuthzClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import java.io.FileInputStream;
import java.io.FileNotFoundException;

@Configuration
public class KeycloakConfig {

    @Autowired
    private KeycloakProperties keycloakProperties;

    @Bean
    public AuthzClient authzClient() throws FileNotFoundException {
        return AuthzClient.create(new FileInputStream("keycloak.json"));
    }

    @Bean
    public Keycloak keycloakAdmin() {
        return Keycloak.getInstance(keycloakProperties.getUri() ,"master", "admin", "admin", "admin-cli");
    }

    @Bean
    public RestClient restClient(){
        return RestClient.create();
    }
}
