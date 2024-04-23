package com.housing.controller;

import com.housing.entity.UserEntity;
import com.housing.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/housing/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserEntity> registerUser(@RequestBody UserEntity user) {
        System.out.println("Received user: " + user);
        UserEntity registeredUser = userService.registerUser(user.getUsername(), user.getEmail(), user.getPassword());
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<UserEntity> loginUser(@RequestBody UserEntity user) {
        System.out.println("Received user: " + user);
        UserEntity loggedInUser = userService.loginUser(user.getUsername(), user.getPassword());
        return ResponseEntity.ok(loggedInUser);
    }
}
