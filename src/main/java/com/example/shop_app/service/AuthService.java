package com.example.shop_app.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
public class AuthService {

    public static final String TOKEN_COOKIE = "token";

    public String getCookie(HttpServletRequest request, String cookieName) {
        return Optional.ofNullable(request.getCookies())
                .stream()
                .flatMap(Arrays::stream)
                .filter(c -> c.getName().equalsIgnoreCase(cookieName))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }

    public Cookie createCookie(String name, String value, boolean httpOnly, int maxAge) {
        Cookie c = new Cookie(name, value);
        c.setMaxAge(maxAge);
        c.setHttpOnly(httpOnly);
        c.setSecure(true);
        c.setAttribute("SameSite", "Strict");
        c.setPath("/");
        return c;
    }

}
