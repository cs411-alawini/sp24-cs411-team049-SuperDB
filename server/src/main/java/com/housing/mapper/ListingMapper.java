package com.housing.mapper;

import com.housing.entity.ListingEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ListingMapper {

    void insertListing(ListingEntity listing);

}
