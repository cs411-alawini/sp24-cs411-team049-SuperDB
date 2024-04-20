package com.housing.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "Property")
public class PropertyEntity {

    @Id
    private Long propertyID;

    private String address;

    @Column(columnDefinition = "TEXT")
    private String amenities;

    private String contactNumber;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private String source;

    private String state;

    private String cityName;

    private String category;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Date time;

}
