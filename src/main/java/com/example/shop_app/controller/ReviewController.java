package com.example.shop_app.controller;

import com.example.shop_app.dto.User;
import com.example.shop_app.entity.Review;
import com.example.shop_app.service.AuthService;
import com.example.shop_app.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private AuthService authService;

    @PostMapping
    public void add(@RequestBody Review review, @RequestParam("productId") Long productId){
        reviewService.add(productId, review);
    }

    @DeleteMapping
    public void remove(@RequestParam("productId") Long productId, Authentication authentication){
        User currentUser = authService.getCurrentUser((Jwt) authentication.getCredentials());
        reviewService.remove(productId, currentUser.email());
    }
}
