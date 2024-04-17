package com.housing.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "Listing")
public class ListingEntity {
    @Id
    private int listingID;

    @Column(nullable = false)
    private long propertyID;

    private Date availableDate;

    private String description;
}
