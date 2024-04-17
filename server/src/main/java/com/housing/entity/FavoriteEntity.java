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

    @Column(nullable = false)
    private int userID;

    @Column(nullable = false)
    private int listingID;

    @Column(nullable = false, precision = 10)
    private BigDecimal priceAtFavTime;

    @Column(nullable = false)
    private Date favTime;
}
