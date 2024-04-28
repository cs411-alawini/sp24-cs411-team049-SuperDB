package com.housing.service.impl;

import com.housing.entity.FavoriteEntity;
import com.housing.mapper.FavoriteMapper;
import com.housing.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.support.SQLExceptionTranslator;
import org.springframework.jdbc.support.SQLStateSQLExceptionTranslator;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    @Autowired
    private FavoriteMapper favoriteMapper;

    private final SQLExceptionTranslator sqlExceptionTranslator = new SQLStateSQLExceptionTranslator();

    @Override
    public void addFavorite(int userId, Long propertyId) {
        FavoriteEntity favorite = new FavoriteEntity();
        favorite.setUserID(userId);
        favorite.setPropertyID(propertyId);

        try {
            favoriteMapper.insertFavorite(favorite);
        } catch (DataAccessException ex) {
            Throwable rootCause = ex.getMostSpecificCause();
            if (rootCause.getMessage().contains("Failed to add to favorites: Listing is not available")) {
                throw new IllegalArgumentException(rootCause.getMessage());
            }
            throw ex;
        }
    }
        @Override
        @Transactional
        public void removeFavorite(int userId, Long propertyId) {
            favoriteMapper.removeFavorite(userId, propertyId);
        }

        @Override
        public List<Long> getFavorites(int userId) {
            return favoriteMapper.findPropertyIdsByUserId(userId);
        }
}