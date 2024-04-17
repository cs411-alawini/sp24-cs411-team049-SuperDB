package com.housing.service;

import com.housing.entity.PropertyEntity;

import java.util.List;

public interface PropertyService {
    List<PropertyEntity> getPropertiesInRectangle(double minLatitude, double maxLatitude,
                                            double minLongitude, double maxLongitude);
}