package com.housing.mapper;

import com.housing.entity.PropertyEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PropertyMapper {
    List<PropertyEntity> findPropertiesInRectangle(@Param("minLatitude") double minLatitude,
                                             @Param("maxLatitude") double maxLatitude,
                                             @Param("minLongitude") double minLongitude,
                                             @Param("maxLongitude") double maxLongitude);
}