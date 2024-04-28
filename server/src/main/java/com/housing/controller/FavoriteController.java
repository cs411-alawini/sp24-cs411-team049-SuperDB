package com.housing.controller;

import com.housing.service.FavoriteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> addFavorite(@RequestParam int userId, @RequestParam Long propertyId) {
        try {
            favoriteService.addFavorite(userId, propertyId);
            return ResponseEntity.ok("OK");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An internal error occurred while processing your request.");
        }
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