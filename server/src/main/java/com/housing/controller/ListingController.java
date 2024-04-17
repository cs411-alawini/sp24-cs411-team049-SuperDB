package com.housing.controller;

import com.housing.model.ListingModel;
import com.housing.service.ListingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/housing/listings")
public class ListingController {

    private final ListingService listingService;

    @Autowired
    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping("/available")
    public ResponseEntity<List<ListingModel>> getAvailableListingsWithHighRatings() {
        List<ListingModel> listings = listingService.getAvailableListingsWithHighRatings();
        log.info(listings.toString());
        return ResponseEntity.ok(listings);
    }

}