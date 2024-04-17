package com.housing.service.impl;

import com.housing.entity.PropertyEntity;
import com.housing.mapper.PropertyMapper;
import com.housing.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyMapper propertyMapper;

    @Override
    public List<PropertyEntity> getPropertiesInRectangle(double minLatitude, double maxLatitude, double minLongitude, double maxLongitude) {
        return propertyMapper.findPropertiesInRectangle(minLatitude, maxLatitude, minLongitude, maxLongitude);
    }
}