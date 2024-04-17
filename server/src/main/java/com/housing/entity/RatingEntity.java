package com.housing.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;

@Data
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
