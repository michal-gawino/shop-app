package com.example.shop_app.config;

import org.apache.http.impl.client.HttpClients;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.authorization.client.AuthzClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import java.io.FileNotFoundException;
import java.util.Map;

@Configuration
public class KeycloakConfig {

    @Autowired
    private KeycloakProperties keycloakProperties;

    @Bean
    public AuthzClient authzClient() throws FileNotFoundException {
        org.keycloak.authorization.client.Configuration configuration = new org.keycloak.authorization.client.Configuration(keycloakProperties.getUri(), keycloakProperties.getRealm(), keycloakProperties.getClient(), Map.of("secret", keycloakProperties.getSecret()), HttpClients.createDefault());
        configuration.setResource(keycloakProperties.getClient());
        return AuthzClient.create(configuration);
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
