package com.housing.service.impl;


import com.housing.mapper.ListingMapper;
import com.housing.model.ListingModel;
import com.housing.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ListingServiceImpl implements ListingService {

    private final ListingMapper listingMapper;

    @Autowired
    public ListingServiceImpl(ListingMapper listingMapper) {
        this.listingMapper = listingMapper;
    }

    @Override
    public List<ListingModel> getAvailableListingsWithHighRatings() {
        return listingMapper.findAvailableListingsWithHighRatings();
    }

}