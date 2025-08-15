package com.example.shop_app.service;

import com.example.shop_app.config.KeycloakProperties;
import com.example.shop_app.exceptions.CannotRefreshTokenException;
import com.example.shop_app.dto.TokenRequest;
import com.example.shop_app.dto.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.keycloak.authorization.client.AuthzClient;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.text.ParseException;
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

    @Autowired
    private KeycloakProperties keycloakProperties;

    @Autowired
    private CookieService cookieService;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    public User login(TokenRequest tokenRequest, HttpServletResponse response) throws ParseException, InterruptedException {
        AccessTokenResponse accessTokenResponse = authzClient.obtainAccessToken(tokenRequest.username(), tokenRequest.password());
        setCookies(response, accessTokenResponse);
        Jwt token = JwtDecoders.fromIssuerLocation(keycloakProperties.getIssuer()).decode(accessTokenResponse.getToken());
        return userService.convertTokenToUser(token);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String cookie = cookieService.getCookie(request, REFRESH_TOKEN_COOKIE);
        if (cookie != null) {
            try {
                String tokenEndpoint = authzClient.getServerConfiguration().getTokenEndpoint();
                MultiValueMap<String, String> body = MultiValueMap.fromMultiValue(Map.of("client_id", List.of(keycloakProperties.getClient()), "grant_type",
                        List.of("refresh_token"), "refresh_token", List.of(cookie), "client_secret", List.of(keycloakProperties.getSecret())));
                ResponseEntity<AccessTokenResponse> entity = restClient.post().uri(tokenEndpoint).body(body).retrieve().toEntity(AccessTokenResponse.class);
                setCookies(response, entity.getBody());
            } catch (Exception ex) {
                throw new CannotRefreshTokenException();
            }
        }
    }

    private void setCookies(HttpServletResponse response, AccessTokenResponse tokenResponse) {
        Cookie tokenCookie = cookieService.createCookie(TOKEN_COOKIE, tokenResponse.getToken(), (int) tokenResponse.getExpiresIn());
        Cookie refreshTokenCookie = cookieService.createCookie(REFRESH_TOKEN_COOKIE, tokenResponse.getRefreshToken(), (int) tokenResponse.getRefreshExpiresIn());
        response.addCookie(tokenCookie);
        response.addCookie(refreshTokenCookie);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        cartService.clear();
        Optional.ofNullable(request.getCookies()).stream().flatMap(Arrays::stream).forEach(c -> cookieService.expiryCookie(c, response));
    }
}
