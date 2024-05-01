package com.housing.controller;

import com.housing.entity.PropertyInsight;
import com.housing.service.PropertyInsightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/housing/property-insights")
public class PropertyInsightController {

    private PropertyInsightService propertyInsightService;

    @Autowired
    public PropertyInsightController(PropertyInsightService propertyInsightService) {
        this.propertyInsightService = propertyInsightService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<PropertyInsight>> getPropertyInsightsByUserId(@PathVariable int userId,
            @RequestParam double minLatitude,
            @RequestParam double maxLatitude,
            @RequestParam double minLongitude,
            @RequestParam double maxLongitude) {
        System.out.println("Fetching property insights for user ID: " + userId);
        System.out.println("Geographical bounds - Min Latitude: " + minLatitude + ", Max Latitude: " + maxLatitude
                + ", Min Longitude: " + minLongitude + ", Max Longitude: " + maxLongitude);

        List<PropertyInsight> insights = propertyInsightService.getPropertyInsightsByUserIdAndLocation(userId,
                minLatitude,
                maxLatitude,
                minLongitude,
                maxLongitude);
        if (insights.isEmpty()) {
            System.out.println("No insights found for user ID: " + userId);
        } else {
            System.out.println("Found " + insights.size() + " insights for user ID: " + userId);
        }
        return ResponseEntity.ok(insights);
    }
}
