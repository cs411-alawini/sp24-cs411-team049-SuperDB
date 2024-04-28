package com.housing.controller;

import com.housing.entity.ListingModel;
import com.housing.service.ListingService;
import com.housing.service.RatingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/housing/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @GetMapping("/score/{propertyId}")
    public ResponseEntity<BigDecimal> getScoreByPropertyId(@PathVariable Long propertyId) {
        BigDecimal score = ratingService.getScoreByPropertyId(propertyId);
        if (score != null) {
            return ResponseEntity.ok(score);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/score/update")
    public ResponseEntity<?> updateScoreByPropertyId(@RequestParam Long propertyId, @RequestBody BigDecimal score) {
        try {
            boolean updated = ratingService.changeRatingScore(propertyId, score);
            if (updated) {
                return ResponseEntity.ok("OK");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the score");
        }
    }
}