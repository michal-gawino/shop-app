package com.example.shop_app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ProfileService {

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    public void uploadAvatar(MultipartFile multipartFile) throws IOException {
        String userId = userService.getCurrentUser().id();
        fileService.uploadAvatar(userId, multipartFile);
    }
}
