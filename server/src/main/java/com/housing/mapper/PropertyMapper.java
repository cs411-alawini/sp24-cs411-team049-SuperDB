package com.housing.mapper;

import com.housing.entity.PropertyModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PropertyMapper {
    List<PropertyModel> findAllPropertiesWithFloorPlans(@Param("minLatitude") double minLatitude,
                                                  @Param("maxLatitude") double maxLatitude,
                                                  @Param("minLongitude") double minLongitude,
                                                  @Param("maxLongitude") double maxLongitude);
}