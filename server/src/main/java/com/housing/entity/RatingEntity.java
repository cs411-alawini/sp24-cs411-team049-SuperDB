package com.housing.entity;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Rating")
public class RatingEntity {

    @Id
    private int ratingID;

    @Column(nullable = false)
    private int propertyID;

    @Column(nullable = false, precision = 10)
    private BigDecimal score;

    @Column(columnDefinition = "TEXT")
    private String description;
}
