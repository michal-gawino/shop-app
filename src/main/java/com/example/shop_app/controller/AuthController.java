package com.example.shop_app.controller;

import com.example.shop_app.security.dto.TokenRequest;
import com.example.shop_app.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.authorization.client.AuthzClient;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.shop_app.service.AuthService.TOKEN_COOKIE;

@RestController
@RequestMapping(path = "/auth")
public class AuthController {

    @Autowired
    private AuthzClient authzClient;

    @Autowired
    private Keycloak keycloakAdmin;

    @Autowired
    private AuthService authService;

    @PostMapping("token")
    public void setToken(@RequestBody TokenRequest tokenRequest, HttpServletResponse response){
        AccessTokenResponse accessTokenResponse = authzClient.obtainAccessToken(tokenRequest.username(), tokenRequest.password());
        int maxAge = (int) accessTokenResponse.getExpiresIn();
        Cookie tokenCookie = authService.createCookie(TOKEN_COOKIE, accessTokenResponse.getToken(), true, maxAge);
        response.addCookie(tokenCookie);
    }

    @GetMapping("logout")
    public void invalidateToken(HttpServletRequest request, HttpServletResponse response) {

    }
}
