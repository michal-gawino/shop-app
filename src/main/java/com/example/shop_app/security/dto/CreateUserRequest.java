package com.example.shop_app.security.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

public record CreateUserRequest(String firstName, String lastName, String email, String username,
                                @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) String password) {


}
