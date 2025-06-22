package com.example.shop_app.controller;

import com.example.shop_app.security.dto.User;
import com.example.shop_app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private AuthService authService;

    @GetMapping
    public User getCurrentUser(Authentication authentication) throws InterruptedException {
        return authService.getCurrentUser(authentication);
    }

}
