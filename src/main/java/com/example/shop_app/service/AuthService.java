package com.example.shop_app.service;

import com.example.shop_app.security.dto.TokenRequest;
import com.example.shop_app.security.dto.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.keycloak.authorization.client.AuthzClient;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
public class AuthService {

    public static final String TOKEN_COOKIE = "token";

    @Autowired
    private AuthzClient authzClient;

    public void login(TokenRequest tokenRequest, HttpServletResponse response){
        AccessTokenResponse accessTokenResponse = authzClient.obtainAccessToken(tokenRequest.username(), tokenRequest.password());
        int maxAge = (int) accessTokenResponse.getExpiresIn();
        Cookie tokenCookie = createCookie(TOKEN_COOKIE, accessTokenResponse.getToken(), true, maxAge);
        response.addCookie(tokenCookie);
    }


    public void logout(HttpServletRequest request, HttpServletResponse response){
        String cookie = getCookie(request, TOKEN_COOKIE);
        if(cookie != null){
            Cookie expiryCookie = createCookie(TOKEN_COOKIE, cookie, true, 0);
            response.addCookie(expiryCookie);
        }
    }

    public User getCurrentUser(Authentication authentication){
        Jwt jwt = (Jwt) authentication.getCredentials();
        String name = jwt.getClaimAsString("name");
        String email = jwt.getClaimAsString("email");
        return new User(name, email);
    }

    public String getCookie(HttpServletRequest request, String cookieName) {
        return Optional.ofNullable(request.getCookies())
                .stream()
                .flatMap(Arrays::stream)
                .filter(c -> c.getName().equalsIgnoreCase(cookieName))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }

    public Cookie createCookie(String name, String value, boolean httpOnly, int maxAge) {
        Cookie c = new Cookie(name, value);
        c.setMaxAge(maxAge);
        c.setHttpOnly(httpOnly);
        c.setSecure(true);
        c.setAttribute("SameSite", "Strict");
        c.setPath("/");
        return c;
    }

}
