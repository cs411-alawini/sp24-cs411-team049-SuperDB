package com.housing.service;

import com.housing.model.ListingModel;
import java.util.List;

public interface ListingService {
    List<ListingModel> getAvailableListingsWithHighRatings();
}