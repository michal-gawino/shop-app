package com.example.shop_app.service;

import com.example.shop_app.exceptions.CannotRefreshTokenException;
import com.example.shop_app.security.dto.TokenRequest;
import com.example.shop_app.security.dto.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.keycloak.authorization.client.AuthzClient;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    public static final String TOKEN_COOKIE = "access_token";
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    @Autowired
    private AuthzClient authzClient;

    @Autowired
    private RestClient restClient;

    public void login(TokenRequest tokenRequest, HttpServletResponse response) {
        AccessTokenResponse accessTokenResponse = authzClient.obtainAccessToken(tokenRequest.username(), tokenRequest.password());
        setCookies(response, accessTokenResponse);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String cookie = getCookie(request, REFRESH_TOKEN_COOKIE);
        if (cookie != null) {
            try {
                String tokenEndpoint = authzClient.getServerConfiguration().getTokenEndpoint();
                MultiValueMap<String, String> body = MultiValueMap.fromMultiValue(Map.of("client_id", List.of("shop-client"), "grant_type",
                        List.of("refresh_token"), "refresh_token", List.of(cookie), "client_secret", List.of("InQc3I2ocqiqRVXPYNSwUCBmxoveDUQo")));
                ResponseEntity<AccessTokenResponse> entity = restClient.post().uri(tokenEndpoint).body(body).retrieve().toEntity(AccessTokenResponse.class);
                setCookies(response, entity.getBody());
            } catch (Exception ex) {
                throw new CannotRefreshTokenException();
            }
        }
    }

    public User getCurrentUser(Authentication authentication) {
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

    public Cookie createCookie(String name, String value, int maxAge) {
        Cookie c = new Cookie(name, value);
        String path = name.equals(TOKEN_COOKIE) ? "/" : "/auth/refresh";
        c.setMaxAge(maxAge);
        c.setHttpOnly(true);
        c.setSecure(true);
        c.setAttribute("SameSite", "Strict");
        c.setPath(path);
        return c;
    }

    private void setCookies(HttpServletResponse response, AccessTokenResponse tokenResponse) {
        Cookie tokenCookie = createCookie(TOKEN_COOKIE, tokenResponse.getToken(), (int) tokenResponse.getExpiresIn());
        Cookie refreshTokenCookie = createCookie(REFRESH_TOKEN_COOKIE, tokenResponse.getRefreshToken(), (int) tokenResponse.getRefreshExpiresIn());
        response.addCookie(tokenCookie);
        response.addCookie(refreshTokenCookie);
    }

}
