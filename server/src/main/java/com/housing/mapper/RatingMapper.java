package com.housing.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.math.BigDecimal;

@Mapper
public interface RatingMapper {

    BigDecimal findScoreByPropertyId(@Param("propertyId") Long propertyId);

    int updateScoreByPropertyId(@Param("propertyId") Long propertyId, @Param("Score") BigDecimal score);
}
