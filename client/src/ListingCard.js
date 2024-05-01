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
import SwipeableViews from "react-swipeable-views";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat, faDog } from "@fortawesome/free-solid-svg-icons";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import Rating from "@mui/material/Rating";

export function ListingCard({
  listing,
  isAdmin,
  onEdit,
  isFavorited,
  toggleFavourite,
  updateRating,
}) {
  const [activeStep, setActiveStep] = useState(0);

  const images = listing.floorPlans.map((plan) =>
    plan.hasPhoto && plan.hasPhoto.startsWith("http")
      ? plan.hasPhoto
      : `${process.env.PUBLIC_URL}/images/default.png`
  );
  const uniqueImages = Array.from(new Set(images));
  const maxSteps = uniqueImages.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps
    );
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  // 处理点击收藏/取消收藏图标
  const handleFavouriteClick = () => {
    toggleFavourite(listing.propertyID, isFavorited); // 传递当前物业ID和新的收藏状态
  };
  // 猫猫狗狗
  const getPetsAllowedIcons = (petsAllowed) => {
    if (!petsAllowed || petsAllowed === "null") {
      return null;
    }
    const icons = [];
    if (petsAllowed.includes("Dogs")) {
      icons.push(<FontAwesomeIcon key="dog-icon" icon={faDog} />);
    }
    if (petsAllowed.includes("Cats")) {
      icons.push(<FontAwesomeIcon key="cat-icon" icon={faCat} />);
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
    }
  };
  useEffect(() => {
    fetchRating(listing.propertyID); // 获取当前房源的评分
  }, [listing.propertyID]); // 当 listing.id 变化时重新获取评分

  const handleRatingChange = async (newRating) => {
    setRating(newRating);
    await updateRating(listing.propertyID, newRating);
  };

  // 解构必要的属性
  const { propertyID, title, address, contactNumber, floorPlans } = listing;

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

  const handleEditClick = () => {
    console.log("Editing listing:", listing);
    onEdit(listing);
  };

  // 默认图片地址
  const defaultImageUrl = `${process.env.PUBLIC_URL}/images/default.png`;
  const mediaStyle = {
    height: 200,
  };

  return (
    <Grid item xs={12} sm={6} md={6}>
      <Card sx={{ maxWidth: 345, m: 2 }}>
        <Box sx={{ position: "relative" }}>
          <SwipeableViews
            axis={"x"}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {uniqueImages.map((img, index) => (
              <CardMedia
                key={index}
                component="img"
                sx={{ height: 200, display: "block", width: "100%" }}
                image={img}
                alt={`Apartment Image ${index + 1}`}
              />
            ))}
          </SwipeableViews>
          {maxSteps > 1 && (
            <React.Fragment>
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255,255,255,0.7)",
                }}
                onClick={handleBack}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255,255,255,0.7)",
                }}
                onClick={handleNext}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </React.Fragment>
          )}
        </Box>
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
              {isFavorited ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
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
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                if (isAdmin) {
                  handleRatingChange(newValue);
                }
              }}
              readOnly={!isAdmin}
            />
            <Box flexGrow={1} /> {/* 这将推动宠物图标到右侧 */}
            {getPetsAllowedIcons(floorPlans[0].petsAllowed)}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {bedBathStr}
          </Typography>
          <Typography variant="body1">{priceRange}</Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            href="email:notice@nexthousing.com"
          >
            Email Property
          </Button>
          {contactNumber && (
            <Button size="small" color="primary" href={`tel:${contactNumber}`}>
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
