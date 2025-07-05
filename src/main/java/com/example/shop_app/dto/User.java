package com.example.shop_app.dto;

import java.util.List;

public record User (String name, String email, List<String> roles){

}
