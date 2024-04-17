package com.housing.controller;

import com.housing.entity.PropertyEntity;
import com.housing.entity.PropertyModel;
import com.housing.service.PropertyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/housing/property")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping("/properties/inRectangle")
    public List<PropertyModel> getPropertiesInRectangle(@RequestParam double minLatitude,
                                                        @RequestParam double maxLatitude,
                                                        @RequestParam double minLongitude,
                                                        @RequestParam double maxLongitude) {
        return propertyService.getPropertiesInRectangle(minLatitude, maxLatitude, minLongitude, maxLongitude);
    }
}