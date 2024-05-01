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

    public List<PropertyInsight> getPropertyInsightsByUserId(int userId) {
        return propertyInsightsMapper.getPropertyInsightsByUserId(userId);
    }
}
