package com.housing.service.impl;

import com.housing.entity.FavoriteEntity;
import com.housing.mapper.FavoriteMapper;
import com.housing.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.support.SQLExceptionTranslator;
import org.springframework.jdbc.support.SQLStateSQLExceptionTranslator;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.Date;

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
        // favorite.setPriceAtFavTime(BigDecimal.ZERO);
        // favorite.setFavTime(new Date());

        try {
            favoriteMapper.insertFavorite(favorite);
        } catch (DataAccessException e) {
            Throwable rootCause = e.getMostSpecificCause();
            if (rootCause instanceof SQLException) {
                SQLException sqlEx = (SQLException) rootCause;
                DataAccessException translatedEx = sqlExceptionTranslator.translate("Insert favorite", null, sqlEx);
                System.err.println("Translated exception: " + translatedEx.getMessage());
                throw translatedEx;
            } else {
                System.err.println("Data access error occurred: " + rootCause.getMessage());
            }
        }
    }
}