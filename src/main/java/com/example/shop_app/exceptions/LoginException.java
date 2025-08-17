package com.example.shop_app.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class LoginException extends RuntimeException{

    public LoginException(String message) {
        super(message);
    }
}
