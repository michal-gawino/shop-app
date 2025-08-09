package com.example.shop_app.controller;

import com.example.shop_app.dto.CreateUserRequest;
import com.example.shop_app.dto.TokenRequest;
import com.example.shop_app.dto.User;
import com.example.shop_app.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping(path = "/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("token")
    public User login(@RequestBody TokenRequest tokenRequest, HttpServletResponse response) throws ParseException, InterruptedException {
        return authService.login(tokenRequest, response);
    }

    @PostMapping("refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response){
        authService.refreshToken(request, response);
    }

    @PostMapping("register")
    public void register(@RequestBody CreateUserRequest createUserRequest){
        authService.register(createUserRequest);
    }

    @PostMapping("logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
    }
}
