package com.example.shop_app.controller;

import com.example.shop_app.dto.CreateUserRequest;
import com.example.shop_app.dto.User;
import com.example.shop_app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

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
    public Page<User> findAll(Pageable pageable) {
        return userService.findAllUsers(pageable);
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
