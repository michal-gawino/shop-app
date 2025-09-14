package com.example.shop_app.service;

import com.example.shop_app.config.KeycloakProperties;
import com.example.shop_app.dto.CreateUserRequest;
import com.example.shop_app.dto.User;
import com.example.shop_app.enumeration.UserRole;
import com.example.shop_app.exceptions.UserCreationException;
import com.google.common.collect.Sets;
import jakarta.ws.rs.core.Response;
import org.apache.commons.codec.binary.Base64;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private KeycloakProperties keycloakProperties;

    @Autowired
    private Keycloak adminClient;

    @Autowired
    private FileService fileService;

    public void register(CreateUserRequest request) {
        RealmResource realm = adminClient.realm(keycloakProperties.getRealm());
        UserRepresentation userRepresentation = getUserRepresentation(request);
        try (Response response = realm.users().create(userRepresentation)) {
            if (response.getStatus() != HttpStatus.CREATED.value()) {
                throw new UserCreationException();
            }
            String[] locationParts = response.getLocation().toString().split("/");
            String id = locationParts[locationParts.length - 1];
            setRoles(id, Set.of(UserRole.USER), Set.of());
        } catch (Exception ex) {
            throw new UserCreationException();
        }
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
        HashSet<UserRole> currentRoles = new HashSet<>(getUserRoles(user.id()));
        HashSet<UserRole> targetRoles = new HashSet<>(user.roles());
        setRoles(id, Sets.difference(targetRoles, currentRoles), Sets.difference(currentRoles, targetRoles));
        usersResource.get(user.id()).update(representation);
        return new User(id, representation.getFirstName(), representation.getLastName(), representation.getEmail(), targetRoles.stream().toList(), null);
    }

    private void setRoles(String userId, Set<UserRole> rolesToAdd, Set<UserRole> rolesToRemove) {
        RealmResource realm = adminClient.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realm.users();
        ClientRepresentation clientRep = realm.clients().findByClientId(keycloakProperties.getClient()).get(0);
        List<RoleRepresentation> newRoles = rolesToAdd.stream().map(r -> realm.clients().get(clientRep.getId()).roles().get(r.name()).toRepresentation()).toList();
        List<RoleRepresentation> rolesToDelete = rolesToRemove.stream().map(r -> realm.clients().get(clientRep.getId()).roles().get(r.name()).toRepresentation()).toList();
        usersResource.get(userId).roles().clientLevel(clientRep.getId()).add(newRoles);
        usersResource.get(userId).roles().clientLevel(clientRep.getId()).remove(rolesToDelete);
    }

    public void deleteUser(String id) {
        RealmResource realmResource = adminClient.realm(keycloakProperties.getRealm());
        realmResource.users().get(id).remove();
    }

    public List<User> findAllUsers() {
        RealmResource realmResource = adminClient.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realmResource.users();
        List<UserRepresentation> users = usersResource.list();
        return users.stream().map(u -> {
                    List<UserRole> roles = getUserRoles(u.getId());
                    return new User(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(), roles, getAvatar(u.getId()));
                }
        ).toList();
    }

    public User getCurrentUser() {
        Authentication credentials = SecurityContextHolder.getContext().getAuthentication();
        return Optional.ofNullable(credentials).map(Authentication::getCredentials).map(cred -> String.valueOf(cred).isEmpty() ? null : convertTokenToUser((Jwt) cred)).orElse(null);
    }

    public User getById(String id) {
        RealmResource realmResource = adminClient.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realmResource.users();
        UserResource userResource = usersResource.get(id);
        return Optional.of(userResource.toRepresentation()).map(u -> {
            List<UserRole> roles = getUserRoles(u.getId());
            return new User(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(), roles, getAvatar(u.getId()));
        }).orElse(null);
    }

    private List<UserRole> getUserRoles(String userId) {
        RealmResource realmResource = adminClient.realm(keycloakProperties.getRealm());
        Set<String> allRoles = Arrays.stream(UserRole.values()).map(Enum::name).collect(Collectors.toSet());
        ClientRepresentation clientRep = realmResource.clients().findByClientId(keycloakProperties.getClient()).get(0);
        List<RoleRepresentation> roleRepresentations = realmResource.users().get(userId).roles().clientLevel(clientRep.getId()).listAll();
        return roleRepresentations.stream().filter(r -> allRoles.contains(r.getName())).map(r -> UserRole.valueOf(r.getName())).toList();
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

    public String getAvatar(String id) {
        File f = fileService.getAvatarFile(id);
        return Optional.ofNullable(f).map(file -> {
            byte[] fileContent = null;
            String mimeType = null;
            Path path = file.toPath();
            try {
                fileContent = Files.readAllBytes(path);
                mimeType = Optional.ofNullable(Files.probeContentType(path)).orElse(MimeTypeUtils.APPLICATION_OCTET_STREAM_VALUE);
            } catch (Exception ex) {
                return null;
            }
            return "data:%s;base64,%s".formatted(mimeType, Base64.encodeBase64String(fileContent));

        }).orElse(null);
    }

    public User convertTokenToUser(Jwt token) {
        String id = token.getClaimAsString("sub");
        String firstName = token.getClaimAsString("given_name");
        String lastName = token.getClaimAsString("family_name");
        String email = token.getClaimAsString("email");
        List<UserRole> roles = token.getClaimAsStringList("roles").stream().map(UserRole::valueOf).toList();
        return new User(id, firstName, lastName, email, roles, getAvatar(id));
    }
}
