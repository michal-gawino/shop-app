package com.example.shop_app.controller;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/")
@RestController
public class HomeController {


    @GetMapping(value = "/auth")
    public AccessTokenResponse accessTokenResponse(){
        Keycloak keycloak = Keycloak.getInstance(
                "http://localhost:8080",
                "master",
                "admin",
                "password",
                "admin-cli");
        UserRepresentation userRepresentation = new UserRepresentation();

        return null;
    }

    @GetMapping
    public String home(@AuthenticationPrincipal Jwt user){
        return user.toString();
    }

}
