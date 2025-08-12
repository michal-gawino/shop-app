package com.example.shop_app.dto;

import com.example.shop_app.UserRole;

import java.util.List;

public record User (String id, String firstName, String lastName, String email, List<UserRole> roles, String avatar){

}
