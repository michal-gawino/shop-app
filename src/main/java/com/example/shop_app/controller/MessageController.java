package com.example.shop_app.controller;

import com.example.shop_app.search.UserChatHistory;
import com.example.shop_app.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("message")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping
    public List<UserChatHistory> getUserMessageHistory(){
        return messageService.getUserChatHistory();
    }

}
