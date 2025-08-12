package com.example.shop_app.service;

import com.example.shop_app.UserRole;
import com.example.shop_app.config.KeycloakProperties;
import com.example.shop_app.exceptions.CannotRefreshTokenException;
import com.example.shop_app.exceptions.UserCreationException;
import com.example.shop_app.dto.CreateUserRequest;
import com.example.shop_app.dto.TokenRequest;
import com.example.shop_app.dto.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.*;
import org.keycloak.authorization.client.AuthzClient;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

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

    @Autowired
    private CookieService cookieService;

    @Autowired
    private FileService fileService;

    public User login(TokenRequest tokenRequest, HttpServletResponse response) throws ParseException, InterruptedException {
        AccessTokenResponse accessTokenResponse = authzClient.obtainAccessToken(tokenRequest.username(), tokenRequest.password());
        setCookies(response, accessTokenResponse);
        Jwt token = JwtDecoders.fromIssuerLocation(keycloakProperties.getIssuer()).decode(accessTokenResponse.getToken());
        return getCurrentUser(token);
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
        Optional.ofNullable(request.getCookies()).stream().flatMap(Arrays::stream).forEach(c -> cookieService.expiryCookie(c, response));
    }

    public void register(CreateUserRequest request) {
        RealmResource realm = adminClient.realm(keycloakProperties.getRealm());
        UserRepresentation userRepresentation = getUserRepresentation(request);
        try (Response response = realm.users().create(userRepresentation)) {
            if (response.getStatus() != HttpStatus.CREATED.value()) {
                throw new UserCreationException();
            }
            String[] locationParts = response.getLocation().toString().split("/");
            String id = locationParts[locationParts.length - 1];
            addRoles(id, List.of(UserRole.USER));
        } catch (Exception ex) {
            throw new UserCreationException();
        }
    }

    private UserRepresentation getUserRepresentation(CreateUserRequest request) {
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
        return userRepresentation;
    }

    public User getCurrentUser(Jwt token) {
        String id = token.getClaimAsString("sub");
        String firstName = token.getClaimAsString("given_name");
        String lastName = token.getClaimAsString("family_name");
        String email = token.getClaimAsString("email");
        List<UserRole> roles = token.getClaimAsStringList("roles").stream().map(UserRole::valueOf).toList();
        return new User(id, firstName, lastName, email, roles, fileService.getAvatar(id));
    }

    private List<UserRole> getUserRoles(String userId) {
        RealmResource realmResource = adminClient.realm(keycloakProperties.getRealm());
        Set<String> allRoles = Arrays.stream(UserRole.values()).map(Enum::name).collect(Collectors.toSet());
        ClientRepresentation clientRep = realmResource.clients().findByClientId(keycloakProperties.getClient()).get(0);
        List<RoleRepresentation> roleRepresentations = realmResource.users().get(userId).roles().clientLevel(clientRep.getId()).listAll();
        return roleRepresentations.stream().filter(r -> allRoles.contains(r.getName())).map(r -> UserRole.valueOf(r.getName())).toList();
    }

    public Page<User> findAllUsers(Pageable pageable) {
        RealmResource realmResource = adminClient.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realmResource.users();
        List<UserRepresentation> users = usersResource.list();
        int total = users.size();
        List<User> list = users.stream().map(u -> {
                    List<UserRole> roles = getUserRoles(u.getId());
                    return new User(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(), roles, null);
                }
        ).toList();
        return new PageImpl<>(list, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()), total);
    }

    public void deleteUser(String id) {
        RealmResource realmResource = adminClient.realm(keycloakProperties.getRealm());
        realmResource.users().get(id).remove();
    }

    public User update(User user) {
        String id = user.id();
        RealmResource realmResource = adminClient.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realmResource.users();
        UserRepresentation representation = usersResource.get(id).toRepresentation();
        if (!representation.getFirstName().equals(user.firstName())) {
            representation.setFirstName(user.firstName());
        }
        if (!representation.getLastName().equals(user.lastName())) {
            representation.setLastName(user.lastName());
        }
        if (!representation.getEmail().equals(user.email())) {
            representation.setEmail(user.email());
        }
        List<UserRole> currentRoles = getUserRoles(user.id());
        List<UserRole> newRoles = user.roles();
        List<UserRole> rolesToAdd = newRoles.stream().filter(r -> !currentRoles.contains(r)).toList();
        if (!rolesToAdd.isEmpty()) {
            addRoles(id, rolesToAdd);
        }
        usersResource.get(user.id()).update(representation);
        return new User(id, representation.getFirstName(), representation.getLastName(), representation.getEmail(), newRoles, null);
    }

    void addRoles(String userId, List<UserRole> rolesToAdd) {
        RealmResource realm = adminClient.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realm.users();
        ClientRepresentation clientRep = realm.clients().findByClientId(keycloakProperties.getClient()).get(0);
        List<RoleRepresentation> roles = rolesToAdd.stream().map(r -> realm.clients().get(clientRep.getId()).roles().get(r.name()).toRepresentation()).toList();
        usersResource.get(userId).roles().clientLevel(clientRep.getId()).add(roles);
    }
}
