package com.housing.entity;

import com.housing.util.UUIDGenerator;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class PropertyModel {

    private Long propertyID;

    private String address;

    private String amenities;

    private String contactNumber;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private String source;

    private String state;

    private String cityName;

    private String category;

    private String title;

    private String description;

    private Date time;

    private List<FloorPlanEntity> floorPlans;

    public PropertyModel() {
        this.propertyID = UUIDGenerator.generateLongUUID();
    }
}
