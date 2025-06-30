package com.example.shop_app.security.dto;

import java.util.List;

public record User (String name, String email, List<String> roles){

}
