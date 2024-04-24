import React from "react";
import {
  Typography,
  Box,
  Grid, Card,
  CardMedia,
  CardContent, Button, CardActions,
  IconButton
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditIcon from '@mui/icons-material/Edit';

export function ListingCard({ listing, isAdmin, onEdit }) {
  // 解构必要的属性
  const { id, title, address, source, floorPlans } = listing;

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
    onEdit(id);
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
          alt="Apartment" />
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
          {isAdmin && (
            <Button
              size="small"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditClick}>
              Edit
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
}
