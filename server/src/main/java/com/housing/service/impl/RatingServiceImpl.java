package com.housing.service.impl;

import com.housing.mapper.RatingMapper;
import com.housing.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
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

    @Override
    public boolean changeRatingScore(Long propertyId, BigDecimal newScore) {
        try {
            int rowsAffected = ratingMapper.updateScoreByPropertyId(propertyId, newScore);
            return rowsAffected > 0;
        } catch (DataAccessException ex) {
            Throwable rootCause = ex.getMostSpecificCause();
            if (rootCause.getMessage().contains("Rating score cannot exceed 5")) {
                throw new IllegalArgumentException(rootCause.getMessage());
            }
            throw ex;
        }
    }
}