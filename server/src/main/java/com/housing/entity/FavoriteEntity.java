package com.housing.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "Favorites")
public class FavoriteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int favoriteID;

    private int userID;

    private Long propertyID;

    private int listingID;

    private BigDecimal priceAtFavTime;

    private Date favTime;
}
