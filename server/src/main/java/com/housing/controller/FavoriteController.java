package com.housing.controller;

import com.housing.service.FavoriteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/housing/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/add")
    public ResponseEntity<String> addFavorite(
            @RequestParam int userId,
            @RequestParam Long propertyId) {
        favoriteService.addFavorite(userId, propertyId);
        return ResponseEntity.ok("OK");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFavorite(
            @RequestParam int userId,
            @RequestParam Long propertyId) {
        favoriteService.removeFavorite(userId, propertyId);
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/get")
    public ResponseEntity<List<Long>> getFavorites(@RequestParam int userId) {
        List<Long> propertyIds = favoriteService.getFavorites(userId);
        return ResponseEntity.ok(propertyIds);
    }
}