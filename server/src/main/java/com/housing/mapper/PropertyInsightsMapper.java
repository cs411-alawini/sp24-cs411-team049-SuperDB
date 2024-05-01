package com.housing.mapper;

import com.housing.entity.PropertyInsight;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PropertyInsightsMapper {
    List<PropertyInsight> getPropertyInsightsByUserIdAndLocation(
            @Param("userId") int userId,
            @Param("minLat") double minLat,
            @Param("maxLat") double maxLat,
            @Param("minLon") double minLon,
            @Param("maxLon") double maxLon);
}
