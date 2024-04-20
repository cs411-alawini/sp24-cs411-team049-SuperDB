package com.housing.entity;

import lombok.Data;

import java.util.Date;

@Data
public class ListingModel {

    private int listingID;
    private long propertyID;
    private Date availableDate;
    private Integer bedrooms;
    private Integer bathrooms;
    private Double averageRating;
}
