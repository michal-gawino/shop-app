package com.example.shop_app.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.RequestUpgradeStrategy;
import org.springframework.web.socket.server.standard.TomcatRequestUpgradeStrategy;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Component
public class CustomUserHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        JwtAuthenticationToken principal = (JwtAuthenticationToken) request.getPrincipal();
        return () -> principal.getToken().getClaimAsString("sub");
    }

    @Override
    public RequestUpgradeStrategy getRequestUpgradeStrategy() {
        return new TomcatRequestUpgradeStrategy();
    }
}
