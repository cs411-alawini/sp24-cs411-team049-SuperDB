package com.housing.entity;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "FloorPlan")
public class FloorPlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int floorPlanID;

    @Column(nullable = false)
    private Long propertyID;

    private Integer bedrooms;

    private Integer bathrooms;

    private Integer squareFeet;

    private BigDecimal price;

    private String currency;

    private BigDecimal fee;

    private Boolean hasPhoto;

    private String petsAllowed;

    private int priceChanged;

}
