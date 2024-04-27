package com.housing.service;

public interface FavoriteService {
    void addFavorite(int userId, Long propertyId, int listingId);
}