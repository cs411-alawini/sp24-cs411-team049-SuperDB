package com.housing.service.impl;

import com.housing.entity.PropertyEntity;
import com.housing.entity.PropertyModel;
import com.housing.entity.FloorPlanEntity;
import com.housing.mapper.PropertyMapper;
import com.housing.service.PropertyService;
import org.springframework.beans.BeanUtils;
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
    public void createProperty(PropertyModel propertyModel) {
        PropertyEntity propertyEntity = convertToPropertyEntity(propertyModel);
        propertyMapper.insertProperty(propertyEntity);

        Long propertyID = propertyEntity.getPropertyID();

        if (propertyModel.getFloorPlans() != null) {
            for (FloorPlanEntity floorPlan : propertyModel.getFloorPlans()) {
                floorPlan.setPropertyID(propertyID);
                propertyMapper.insertFloorPlan(floorPlan);
            }
        }
    }


    @Override
    @Transactional
    public void updateProperty(PropertyModel propertyModel) {
        PropertyEntity propertyEntity = convertToPropertyEntity(propertyModel);
        propertyMapper.updateProperty(propertyEntity);
        propertyMapper.deleteFloorPlans(propertyModel.getPropertyID());

        if (propertyModel.getFloorPlans() != null) {
            for (FloorPlanEntity floorPlan : propertyModel.getFloorPlans()) {
                floorPlan.setPropertyID(propertyModel.getPropertyID());
                propertyMapper.insertFloorPlan(floorPlan);
            }
        }
    }

    private PropertyEntity convertToPropertyEntity(PropertyModel propertyModel) {
        PropertyEntity propertyEntity = new PropertyEntity();
        BeanUtils.copyProperties(propertyModel, propertyEntity, "propertyID");
        return propertyEntity;
    }

    @Transactional
    @Override
    public void deleteProperty(Long propertyId) {
        propertyMapper.deleteFloorPlans(propertyId);
        propertyMapper.deleteProperty(propertyId);
    }
}