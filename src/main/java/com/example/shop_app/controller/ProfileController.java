package com.example.shop_app.controller;

import com.example.shop_app.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PostMapping("/avatar")
    public void uploadAvatar(@RequestPart("file") MultipartFile multipartFile) throws IOException {
        this.profileService.uploadAvatar(multipartFile);
    }
}
