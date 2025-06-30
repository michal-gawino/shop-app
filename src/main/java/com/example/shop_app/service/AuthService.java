package com.example.shop_app.service;

import com.example.shop_app.config.KeycloakProperties;
import com.example.shop_app.exceptions.CannotRefreshTokenException;
import com.example.shop_app.exceptions.UserCreationException;
import com.example.shop_app.security.dto.CreateUserRequest;
import com.example.shop_app.security.dto.TokenRequest;
import com.example.shop_app.security.dto.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.*;
import org.keycloak.authorization.client.AuthzClient;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.*;

@Service
public class AuthService {

    public static final String TOKEN_COOKIE = "access_token";
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    @Autowired
    private AuthzClient authzClient;

    @Autowired
    private RestClient restClient;

    @Autowired
    private Keycloak adminClient;

    @Autowired
    private KeycloakProperties keycloakProperties;

    public void login(TokenRequest tokenRequest, HttpServletResponse response) {
        AccessTokenResponse accessTokenResponse = authzClient.obtainAccessToken(tokenRequest.username(), tokenRequest.password());
        setCookies(response, accessTokenResponse);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String cookie = getCookie(request, REFRESH_TOKEN_COOKIE);
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

    public void register(CreateUserRequest request) {
        RealmResource realm = adminClient.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realm.users();
        UserRepresentation userRepresentation = new UserRepresentation();
        CredentialRepresentation password = new CredentialRepresentation();
        password.setType(CredentialRepresentation.PASSWORD);
        password.setValue(request.password());
        password.setTemporary(false);
        userRepresentation.setEnabled(true);
        userRepresentation.setEmailVerified(true);
        userRepresentation.setUsername(request.username());
        userRepresentation.setFirstName(request.firstName());
        userRepresentation.setLastName(request.lastName());
        userRepresentation.setEmail(request.email());
        userRepresentation.setCredentials(List.of(password));

        try (Response response = realm.users().create(userRepresentation)) {
            if (response.getStatus() != HttpStatus.CREATED.value()) {
                System.out.println(response.getStatus());
                throw new UserCreationException();
            }
            UserRepresentation user = realm.users().search(request.username()).get(0);
            ClientRepresentation clientRep = realm.clients().findByClientId(keycloakProperties.getClient()).get(0);
            RoleRepresentation role = realm.clients().get(clientRep.getId()).roles().get("USER").toRepresentation();
            usersResource.get(user.getId()).roles().clientLevel(clientRep.getId()).add(Arrays.asList(role));
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            throw new UserCreationException();
        }


    }

    public User getCurrentUser(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getCredentials();
        String name = jwt.getClaimAsString("name");
        String email = jwt.getClaimAsString("email");
        List<String> roles = jwt.getClaimAsStringList("roles");
        return new User(name, email, roles);
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
