package com.housing.service;

import com.housing.entity.PropertyInsight;
import com.housing.mapper.PropertyInsightsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PropertyInsightService {

    @Autowired
    private PropertyInsightsMapper propertyInsightsMapper;

    public List<PropertyInsight> getPropertyInsightsByUserIdAndLocation(int userId, double minLat, double maxLat,
            double minLon, double maxLon) {
        return propertyInsightsMapper.getPropertyInsightsByUserIdAndLocation(userId, minLat, maxLat, minLon, maxLon);
    }
}
