package com.housing.mapper;

import com.housing.entity.PropertyInsight;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PropertyInsightsMapper {
    List<PropertyInsight> getPropertyInsightsByUserId(@Param("userId") int userId);
}
