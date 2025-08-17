package com.example.shop_app.controller;

import com.example.shop_app.dto.CreateUserRequest;
import com.example.shop_app.dto.User;
import com.example.shop_app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("current")
    public User getCurrentUser() {
        return userService.getCurrentUser();
    }

    @GetMapping
    public List<User> findAll() {
        return userService.findAllUsers();
    }

    @PutMapping
    public User update(@RequestBody User user) {
        return userService.update(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        userService.deleteUser(id);
    }

    @PostMapping("register")
    public void register(@RequestBody CreateUserRequest createUserRequest) {
        userService.register(createUserRequest);
    }

}
