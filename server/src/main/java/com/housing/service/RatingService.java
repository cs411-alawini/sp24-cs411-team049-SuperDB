package com.housing.service;

import java.math.BigDecimal;

public interface RatingService {
    BigDecimal getScoreByPropertyId(Long propertyId);
}
