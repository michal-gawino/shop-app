package com.example.shop_app.controller;

import com.example.shop_app.dto.User;
import com.example.shop_app.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private AuthService authService;

    @GetMapping
    public User getCurrentUser(HttpServletRequest request, Authentication authentication) {
        Jwt token = (Jwt) authentication.getCredentials();
        return authService.getCurrentUser(token);
    }

}
