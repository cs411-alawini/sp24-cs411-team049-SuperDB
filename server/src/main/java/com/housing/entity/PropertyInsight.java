package com.housing.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "PropertyInsight")
public class PropertyInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long propertyID;

    @Column(nullable = false)
    private int favoriteCount;

    @Column(nullable = false)
    private double avgRating;

    @Column(nullable = true, length = 500)
    private String insight;

    @Column(nullable = false, length = 100)
    private String propertyName;

    @Column(nullable = true, length = 500)
    private String description;

}
