import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CardActions,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat, faDog } from "@fortawesome/free-solid-svg-icons";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditIcon from "@mui/icons-material/Edit";
import Rating from "@mui/material/Rating";

export function ListingCard({ listing, isAdmin, onEdit }) {
  // 猫猫狗狗
  const getPetsAllowedIcons = (petsAllowed) => {
    if (!petsAllowed || petsAllowed === "null") {
      return null; // 如果 petsAllowed 是 "null" 或未定义，则不显示任何图标
    }
    const icons = [];
    if (petsAllowed.includes("Dogs")) {
      icons.push(<FontAwesomeIcon key="dog-icon" icon={faDog} />); // 添加狗狗图标
    }
    if (petsAllowed.includes("Cats")) {
      icons.push(<FontAwesomeIcon key="cat-icon" icon={faCat} />); // 添加猫猫图标
    }
    return <Box display="flex">{icons}</Box>;
  };

  // 评分
  const [rating, setRating] = useState(0);

  const fetchRating = async (propertyId) => {
    try {
      const numericPropertyId = Number(propertyId);
      const response = await fetch(
        `/housing/ratings/score/${numericPropertyId}`
      );
      const score = await response.json();
      setRating(score); // 将获取的评分设置到状态中
    } catch (error) {
      console.error("Failed to fetch rating:", error);
      // 处理错误情况
    }
  };
  useEffect(() => {
    fetchRating(listing.propertyID); // 获取当前房源的评分
  }, [listing.propertyID]); // 当 listing.id 变化时重新获取评分
  // 解构必要的属性
  const { propertyID, title, address, source, floorPlans } = listing;

  const getBedBathString = (floorPlans) => {
    if (floorPlans.length === 1) {
      const singlePlan = floorPlans[0];
      return `${singlePlan.bedrooms} Bed | ${singlePlan.bathrooms} Bath`;
    }
    const beds = floorPlans.map((fp) => fp.bedrooms);
    const baths = floorPlans.map((fp) => fp.bathrooms);
    return `${Math.min(...beds)}-${Math.max(...beds)} Beds | ${Math.min(
      ...baths
    )}-${Math.max(...baths)} Baths`;
  };

  // Updated function to handle a single price
  const getPriceRange = (floorPlans) => {
    if (floorPlans.length === 1) {
      return `$${floorPlans[0].price}`;
    }
    const prices = floorPlans.map((fp) => fp.price);
    return `$${Math.min(...prices)} - $${Math.max(...prices)}`;
  };

  // 获取卧室和浴室描述
  const bedBathStr = getBedBathString(floorPlans);

  // 获取价格范围描述
  const priceRange = getPriceRange(floorPlans);

  const handleFavouriteClick = () => {
    // 这里你可以添加逻辑来更新用户的收藏状态
    console.log(`${title} is favourited:`);
  };

  const handleEditClick = () => {
    console.log("Editing listing:", listing);
    onEdit(listing);
  };

  // 默认图片地址
  const defaultImageUrl = `${process.env.PUBLIC_URL}/images/default.png`;
  const mediaStyle = {
    height: 200, // Adjust this value to change the image height
  };

  return (
    <Grid item xs={12} sm={6} md={6}>
      <Card sx={{ maxWidth: 345, m: 2 }}>
        <CardMedia
          component="img"
          height="140"
          image={defaultImageUrl}
          sx={mediaStyle}
          alt="Apartment"
        />
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h7" component="div">
              {title}
            </Typography>
            <IconButton onClick={handleFavouriteClick}>
              {/* Dummy icon */}
              <FavoriteBorderIcon color={false ? "error" : "action"} />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {address || "Fetching address..."}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            mt={1}
            mb={2}
            justifyContent="space-between" // 这将确保评分在左侧，图标在右侧
          >
            <Rating value={rating} readOnly />
            <Box flexGrow={1} /> {/* 这将推动宠物图标到右侧 */}
            {getPetsAllowedIcons(floorPlans[0].petsAllowed)}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {bedBathStr}
          </Typography>
          <Typography variant="body1">{priceRange}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            Email Property
          </Button>
          {source && (
            <Button size="small" color="primary" href={`tel:${source}`}>
              Call
            </Button>
          )}
          <Box flexGrow={1} display="flex" justifyContent="flex-end">
            {isAdmin && (
              <Button
                size="small"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
              >
                Edit
              </Button>
            )}
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
}
