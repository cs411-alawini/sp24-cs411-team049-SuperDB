package com.housing.controller;

import com.housing.entity.UserEntity;
import com.housing.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/housing/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserEntity> registerUser(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password) {
        UserEntity registeredUser = userService.registerUser(username, email, password);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<UserEntity> loginUser(
            @RequestParam String username,
            @RequestParam String password) {
        UserEntity loggedInUser = userService.loginUser(username, password);
        return ResponseEntity.ok(loggedInUser);
    }
}
