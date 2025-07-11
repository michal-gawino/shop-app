package com.example.shop_app.entity;


import java.time.LocalDateTime;

public record Review(double rating, String comment, LocalDateTime reviewDate, String name, String email) {
}
