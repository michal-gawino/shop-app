package com.example.shop_app.search;

import com.example.shop_app.dto.ChatMessage;
import com.example.shop_app.dto.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserChatHistory {

    private String chatId;
    private List<ChatMessage> messages;
    private User user;

}
