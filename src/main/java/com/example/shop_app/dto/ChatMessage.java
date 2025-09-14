package com.example.shop_app.dto;

import java.time.Instant;
import java.util.List;

public record ChatMessage(String id, String senderId, String chatId, String content, Instant date, List<String> users) {
}
