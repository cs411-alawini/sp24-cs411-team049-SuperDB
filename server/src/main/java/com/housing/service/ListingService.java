package com.housing.service;

import com.housing.entity.ListingModel;
import java.util.List;

public interface ListingService {
    List<ListingModel> getAvailableListingsWithHighRatings();
}