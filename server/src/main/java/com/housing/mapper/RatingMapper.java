package com.housing.mapper;

import com.housing.entity.RatingEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.math.BigDecimal;

@Mapper
public interface RatingMapper {

    @Select("SELECT COALESCE(MAX(RatingID), 0) FROM Rating")
    int getMaxRatingId();

    void insertRating(RatingEntity rating);

    BigDecimal findScoreByPropertyId(@Param("propertyId") Long propertyId);

    int updateScoreByPropertyId(@Param("propertyId") Long propertyId, @Param("Score") BigDecimal score);
}
