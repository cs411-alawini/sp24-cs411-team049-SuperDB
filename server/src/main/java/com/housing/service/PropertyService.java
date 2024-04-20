package com.housing.service;

import com.housing.entity.PropertyModel;

import java.util.List;

public interface PropertyService {
    List<PropertyModel> getPropertiesInRectangle(double minLatitude, double maxLatitude,
                                                 double minLongitude, double maxLongitude);
}