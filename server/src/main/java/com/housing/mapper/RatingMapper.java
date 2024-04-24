package com.housing.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.math.BigDecimal;

@Mapper
public interface RatingMapper {

    @Select("SELECT score FROM Rating WHERE propertyID = #{propertyId}")
    BigDecimal findScoreByPropertyId(@Param("propertyId") Long propertyId);
}
