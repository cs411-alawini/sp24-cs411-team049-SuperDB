package com.housing.mapper;

import com.housing.model.ListingModel;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ListingMapper {

    List<ListingModel> findAvailableListingsWithHighRatings();
}
