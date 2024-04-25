package com.housing.service.impl;

import com.housing.entity.PropertyModel;
import com.housing.entity.FloorPlanEntity;
import com.housing.mapper.PropertyMapper;
import com.housing.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyMapper propertyMapper;

    @Override
    public List<PropertyModel> getPropertiesInRectangle(double minLatitude, double maxLatitude, double minLongitude, double maxLongitude, String title) {
        return propertyMapper.findAllPropertiesWithFloorPlans(minLatitude, maxLatitude, minLongitude, maxLongitude, title);
    }

    @Override
    @Transactional
    public void createProperty(PropertyModel property) {
        propertyMapper.insertProperty(property);
        if (property.getFloorPlans() != null) {
            for (FloorPlanEntity floorPlan : property.getFloorPlans()) {
                floorPlan.setPropertyID(property.getPropertyID()); // 手动设置 PropertyID
                propertyMapper.insertFloorPlan(floorPlan);
            }
        }
    }

    @Override
    @Transactional
    public void updateProperty(PropertyModel property) {
        propertyMapper.updateProperty(property);
        propertyMapper.deleteFloorPlans(property.getPropertyID());
        if (property.getFloorPlans() != null) {
            for (FloorPlanEntity floorPlan : property.getFloorPlans()) {
                floorPlan.setPropertyID(property.getPropertyID()); // 手动设置 PropertyID
                propertyMapper.insertFloorPlan(floorPlan);
            }
        }
    }


    @Transactional
    @Override
    public void deleteProperty(Long propertyId) {
        propertyMapper.deleteFloorPlans(propertyId);
        propertyMapper.deleteProperty(propertyId);
    }
}