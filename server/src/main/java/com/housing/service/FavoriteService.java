package com.housing.service;

import java.util.List;

public interface FavoriteService {
    void addFavorite(int userId, Long propertyId);
    void removeFavorite(int userId, Long propertyId);
    List<Long> getFavorites(int userId);
}