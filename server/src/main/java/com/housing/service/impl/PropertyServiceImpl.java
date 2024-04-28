package com.housing.service.impl;

import com.housing.entity.PropertyEntity;
import com.housing.entity.PropertyModel;
import com.housing.entity.FloorPlanEntity;
import com.housing.mapper.PropertyMapper;
import com.housing.service.PropertyService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
        PropertyEntity propertyEntity = createPropertyEntity(propertyModel);
        try {
            propertyMapper.insertProperty(propertyEntity);
        } catch (DataAccessException ex) {
            handleContactNumberException(ex);
        }

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
        PropertyEntity propertyEntity = propertyMapper.getPropertyById(propertyModel.getPropertyID());
        if (propertyEntity != null) {
            BeanUtils.copyProperties(propertyModel, propertyEntity);
            try {
                propertyMapper.updateProperty(propertyEntity);
            } catch (DataAccessException ex) {
                handleContactNumberException(ex);
            }
        } else {
            throw new IllegalStateException("No property found with ID: " + propertyModel.getPropertyID());
        }

        List<FloorPlanEntity> existingFloorPlans = propertyMapper.getFloorPlansByPropertyId(propertyModel.getPropertyID());

        Set<Integer> incomingIds = propertyModel.getFloorPlans().stream()
                .map(FloorPlanEntity::getFloorPlanID)
                .collect(Collectors.toSet());

        existingFloorPlans.stream()
                .filter(f -> !incomingIds.contains(f.getFloorPlanID()))
                .forEach(f -> propertyMapper.deleteFloorPlanById(f.getFloorPlanID()));

        for (FloorPlanEntity incomingFloorPlan : propertyModel.getFloorPlans()) {
            incomingFloorPlan.setPropertyID(propertyModel.getPropertyID());
            Optional<FloorPlanEntity> existingPlan = existingFloorPlans.stream()
                    .filter(f -> f.getFloorPlanID().equals(incomingFloorPlan.getFloorPlanID()))
                    .findFirst();

            if (existingPlan.isPresent()) {
                if (!incomingFloorPlan.getPrice().equals(existingPlan.get().getPrice())) {
                    incomingFloorPlan.setPriceChanged(1);
                }
                propertyMapper.updateFloorPlan(incomingFloorPlan);
            } else {
                propertyMapper.insertFloorPlan(incomingFloorPlan);
            }
        }
    }

    private void handleContactNumberException(DataAccessException ex) {
        Throwable rootCause = ex.getMostSpecificCause();
        if (rootCause.getMessage().contains("Contact number must be exactly 10 digits") ||
                rootCause.getMessage().contains("The first digit of the contact number must be between 2 and 9")) {
            throw new IllegalArgumentException(rootCause.getMessage());
        }
        throw ex;
    }


    private PropertyEntity createPropertyEntity(PropertyModel propertyModel) {
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