package com.housing.mapper;

import com.housing.entity.FloorPlanEntity;
import com.housing.entity.PropertyEntity;
import com.housing.entity.PropertyModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PropertyMapper {
    List<PropertyModel> findAllPropertiesWithFloorPlans(@Param("minLatitude") double minLatitude,
                                                        @Param("maxLatitude") double maxLatitude,
                                                        @Param("minLongitude") double minLongitude,
                                                        @Param("maxLongitude") double maxLongitude,
                                                        @Param("title") String title);

    void insertProperty(PropertyEntity property);

    void updateProperty(PropertyEntity property);

    void deleteProperty(@Param("propertyId") Long propertyId);

    List<FloorPlanEntity> selectFloorPlansByProperty(Long propertyID);

    void insertFloorPlan(FloorPlanEntity floorPlan);

    void deleteFloorPlans(@Param("propertyId") Long propertyId);
}