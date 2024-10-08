package com.housing.controller;

import com.housing.entity.PropertyModel;
import com.housing.service.PropertyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/housing/property")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping("/properties/inRectangle")
    public List<PropertyModel> getPropertiesInRectangle(@RequestParam double minLatitude,
                                                        @RequestParam double maxLatitude,
                                                        @RequestParam double minLongitude,
                                                        @RequestParam double maxLongitude,
                                                        @RequestParam(required = false) String title) {
        return propertyService.getPropertiesInRectangle(minLatitude, maxLatitude, minLongitude, maxLongitude, title);
    }

    @PostMapping("/properties/create")
    public ResponseEntity<?> createProperty(@RequestBody PropertyModel property) {
        try {
            log.info("Creating new property with details: {}", property);
            propertyService.createProperty(property);
            return ResponseEntity.ok("OK");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the property");
        }
    }

    @PutMapping("/properties/update/")
    public ResponseEntity<?> updateProperty(@RequestBody PropertyModel property) {
        try {
            log.info("Updating property with details: {}", property);
            propertyService.updateProperty(property);
            return ResponseEntity.ok("OK");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the property");
        }
    }

    @DeleteMapping("/properties/delete/{propertyId}")
    public ResponseEntity<?> deleteProperty(@PathVariable Long propertyId) {
        log.info("Deleting property with ID {}", propertyId);
        propertyService.deleteProperty(propertyId);
        return ResponseEntity.ok("OK");
    }
}