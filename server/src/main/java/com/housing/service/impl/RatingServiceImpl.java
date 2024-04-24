package com.housing.service.impl;

import com.housing.mapper.RatingMapper;
import com.housing.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingMapper ratingMapper;

    @Override
    public BigDecimal getScoreByPropertyId(Long propertyId) {
        return ratingMapper.findScoreByPropertyId(propertyId);
    }
}