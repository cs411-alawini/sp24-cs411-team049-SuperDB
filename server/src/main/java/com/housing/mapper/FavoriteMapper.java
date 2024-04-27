package com.housing.mapper;

import com.housing.entity.FavoriteEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FavoriteMapper {
    void insertFavorite(FavoriteEntity favorite);
    void removeFavorite(int userId, Long propertyId);
    List<Long> findPropertyIdsByUserId(int userId);
}