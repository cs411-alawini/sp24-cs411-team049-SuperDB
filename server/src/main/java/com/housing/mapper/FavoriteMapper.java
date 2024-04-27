package com.housing.mapper;

import com.housing.entity.FavoriteEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FavoriteMapper {
    void insertFavorite(FavoriteEntity favorite);
}