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
        List<PropertyInsight> insights = propertyInsightService.getPropertyInsightsByUserIdAndLocation(userId,
                minLatitude,
                maxLatitude,
                minLongitude,
                maxLongitude);
        return ResponseEntity.ok(insights);
    }
}
