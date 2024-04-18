package com.housing.entity;
import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "FloorPlan")
public class FloorPlanEntity {

    @Id
    private int floorPlanID;

    @Column(nullable = false)
    private long propertyID;

    private Integer bedrooms;

    private Integer bathrooms;

    private Integer squareFeet;

    private BigDecimal price;

    private String currency;

    private BigDecimal fee;

    private Boolean hasPhoto;

    private String petsAllowed;

}
