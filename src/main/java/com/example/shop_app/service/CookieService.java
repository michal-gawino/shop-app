package com.example.shop_app.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class CookieService {

    public String getCookie(HttpServletRequest request, String cookieName) {
        return Optional.ofNullable(request.getCookies())
                .stream()
                .flatMap(Arrays::stream)
                .filter(c -> c.getName().equalsIgnoreCase(cookieName))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }

    public Cookie createCookie(String name, String value, int maxAge) {
        Cookie c = new Cookie(name, value);
        String path = "/";
        c.setMaxAge(maxAge);
        c.setHttpOnly(true);
        c.setSecure(true);
        c.setAttribute("SameSite", "Strict");
        c.setPath(path);
        return c;
    }

    public void expiryCookie(Cookie c, HttpServletResponse response){
        c.setValue("");
        c.setPath("/");
        c.setMaxAge(0);
        response.addCookie(c);
    }
}
