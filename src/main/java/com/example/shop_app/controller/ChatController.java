package com.example.shop_app.controller;

import com.example.shop_app.dto.ChatMessage;
import com.example.shop_app.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private MessageService messageService;

    @MessageMapping({"/chat/{id}"})
    public void listen(Message<ChatMessage> message, @DestinationVariable("id") String chatId) {
        ChatMessage payload = message.getPayload();

        payload.users().forEach(u -> {
            template.convertAndSendToUser(u, "/queue/messages", payload);
        });

        messageService.save(payload);
    }

}
