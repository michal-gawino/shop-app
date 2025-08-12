package com.example.shop_app.controller;

import com.example.shop_app.dto.User;
import com.example.shop_app.service.AuthService;
import com.example.shop_app.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private FileService fileService;

    @GetMapping("current")
    public User getCurrentUser(Authentication authentication) {
        Jwt token = (Jwt) authentication.getCredentials();
        return authService.getCurrentUser(token);
    }

    @GetMapping
    public Page<User> findAll(Pageable pageable) {
        return authService.findAllUsers(pageable);
    }

    @PutMapping
    public User update(@RequestBody User user) {
        return authService.update(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        authService.deleteUser(id);
    }

    @PostMapping("/avatar")
    public void uploadAvatar(@RequestPart("file") MultipartFile multipartFile, Authentication authentication) throws IOException {
        User currentUser = authService.getCurrentUser((Jwt) authentication.getCredentials());
        String id = currentUser.id();
        this.fileService.uploadAvatar(id, multipartFile);
    }

}
