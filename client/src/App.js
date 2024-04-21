import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Pagination,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardActions,
  IconButton,
  Slider,
  Popover,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { UserProvider } from "./UserContext";

import axios from "axios";

const mapStyles = [
  {
    featureType: "administrative.land_parcel",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 64px)",
};

const defaultCenter = {
  lat: 40.1019523,
  lng: -88.2297364,
};

const addressCache = {};

function App() {
  // Price range
  const [allListings, setAllListings] = useState([]);
  const [displayedListings, setDisplayedListings] = useState([]);

  const [priceAnchorEl, setPriceAnchorEl] = useState(null);
  const [priceLimits, setPriceLimits] = useState({ min: 100, max: 5000 });
  const [selectedPriceRange, setSelectedPriceRange] = useState([100, 5000]);

  // 筛选
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBedBath, setSelectedBedBath] = useState("");
  const [selectedOther, setSelectedOther] = useState([]);
  const [bedBathOptions, setBedBathOptions] = useState([]);
  const [amenitiesOptions, setAmenitiesOptions] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const [activeMarker, setActiveMarker] = useState(null);
  // 翻页相关
  const [currentPage, setCurrentPage] = useState(1);

  const open = Boolean(priceAnchorEl);
  const id = open ? "price-popover" : undefined;

  useEffect(() => {
    setCurrentPage(1); // 每次displayedListings变化时，重置到第一页
  }, [displayedListings]);

  useEffect(() => {
    const bedBathOptionsSet = new Set();
    const amenitiesOptionsSet = new Set();

    allListings.forEach((listing) => {
      // Extract and add unique bed/bath combinations
      listing.floorPlans.forEach((plan) => {
        const bedBathString = `${plan.bedrooms}b${plan.bathrooms}b`;
        bedBathOptionsSet.add(bedBathString);
      });

      // Split amenities, filter out 'null', and add unique amenities
      listing.amenities
        .split(",")
        .filter((amenity) => amenity.trim().toLowerCase() !== "null")
        .forEach((amenity) => {
          amenitiesOptionsSet.add(amenity.trim());
        });
    });

    setBedBathOptions([...bedBathOptionsSet]);
    setAmenitiesOptions([...amenitiesOptionsSet]);
  }, [allListings]);

  useEffect(() => {
    let updatedListings = [...allListings];

    // 应用价格筛选
    if (selectedPriceRange) {
      updatedListings = updatedListings.filter((listing) => {
        const price = listing.floorPlans[0].price;
        return price >= selectedPriceRange[0] && price <= selectedPriceRange[1];
      });
    }

    // 应用床位/浴室筛选
    if (selectedBedBath) {
      const [beds, baths] = selectedBedBath.split("b");
      updatedListings = updatedListings.filter((listing) =>
        listing.floorPlans.some(
          (plan) =>
            plan.bedrooms.toString() === beds &&
            plan.bathrooms.toString() === baths
        )
      );
    }

    // 应用其他便利设施筛选
    if (selectedOther.length > 0) {
      updatedListings = updatedListings.filter((listing) =>
        selectedOther.every((amenity) =>
          listing.amenities
            .split(",")
            .map((a) => a.trim())
            .includes(amenity)
        )
      );
    }

    // 应用排序
    if (sortOption === "Lowest Price") {
      updatedListings.sort(
        (a, b) => a.floorPlans[0].price - b.floorPlans[0].price
      );
    } else if (sortOption === "Highest Price") {
      updatedListings.sort(
        (a, b) => b.floorPlans[0].price - a.floorPlans[0].price
      );
    }

    setDisplayedListings(updatedListings);
  }, [
    selectedBedBath,
    selectedOther,
    sortOption,
    selectedPriceRange,
    allListings,
  ]);

  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handlePriceClick = (event) => {
    setPriceAnchorEl(event.currentTarget);
  };

  const handlePriceClose = () => {
    setPriceAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLoginClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const [bounds, setBounds] = useState(null);
  const mapRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  const handleBoundsChange = () => {
    if (!mapRef.current) return;

    const bounds = mapRef.current.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const latLngBounds = {
      minLatitude: sw.lat(),
      maxLatitude: ne.lat(),
      minLongitude: sw.lng(),
      maxLongitude: ne.lng(),
    };

    setSelectedBedBath("");
    setSelectedOther([]);
    setSortOption("");
    setBounds(latLngBounds);
    fetchListings(latLngBounds);
  };

  const fetchAddress = async (latitude, longitude) => {
    const latLngKey = `${latitude},${longitude}`;
    if (addressCache[latLngKey]) {
      return addressCache[latLngKey];
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDNvm9qmRm_qIhkcY9ryTzuVCciCSTmrvg&language=en`;
    const response = await fetch(url);
    const data = await response.json();
    const address = data.results[0]?.formatted_address || "Address not found";
    addressCache[latLngKey] = address;

    return address;
  };

  const fetchListings = async (bounds) => {
    const url = `/housing/property/properties/inRectangle?minLatitude=${bounds.minLatitude}&maxLatitude=${bounds.maxLatitude}&minLongitude=${bounds.minLongitude}&maxLongitude=${bounds.maxLongitude}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const prices = data.map((listing) => listing.floorPlans[0].price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceLimits({ min: minPrice, max: maxPrice });
      setSelectedPriceRange([minPrice, maxPrice]); // 重置选定的价格范围

      // 创建一个新的数组来保存包含地址信息的房产列表
      const updatedListings = await Promise.all(
        data.map(async (listing) => {
          // 如果房产对象没有地址信息，则调用 fetchAddress 函数获取
          if (listing.address === "null") {
            listing.address = await fetchAddress(
              listing.latitude,
              listing.longitude
            );
          }
          return listing;
        })
      );

      // setListings(updatedListings);
      setAllListings(updatedListings); // 存储完整的房源列表
      setDisplayedListings(updatedListings); // 默认情况下，显示的列表与完整列表相同
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      // 处理错误，可能是设置一个状态来显示错误信息
    }
  };

  // 分页相关计算
  const listingsPerPage = 10;
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = displayedListings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );
  console.log("currentListings:", currentListings);
  const totalPages = Math.ceil(displayedListings.length / listingsPerPage);

  return (
    <UserProvider>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              NextHousing
            </Typography>
            <Button color="inherit" onClick={handleLoginClick}>
              LOGIN
            </Button>
            <LoginDialog open={dialogOpen} onClose={handleDialogClose} />
          </Toolbar>
        </AppBar>
        <Container
          maxWidth={false}
          sx={{ paddingY: 1, borderBottom: 1, borderColor: "divider" }}
        >
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="flex-start"
          >
            {/* 搜索框 */}
            <Grid item>
              <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 300, marginRight: 2 }}
              />
            </Grid>

            {/* 床位/浴室筛选 */}
            <Grid item>
              <FormControl
                variant="outlined"
                sx={{ minWidth: 140, marginRight: 2 }}
              >
                <InputLabel>Beds/Baths</InputLabel>
                <Select
                  value={selectedBedBath}
                  onChange={(e) => setSelectedBedBath(e.target.value)}
                  label="Beds/Baths"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {bedBathOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option.replace("b", " Bed ").replace("b", " Bath")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 其他选项 */}
            <Grid item>
              <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel>Others</InputLabel>
                <Select
                  multiple
                  value={selectedOther}
                  onChange={(e) => setSelectedOther(e.target.value)}
                  label="Others"
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        overflow: "auto",
                      },
                    },
                  }}
                >
                  {amenitiesOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      <Checkbox checked={selectedOther.indexOf(option) > -1} />
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 价格筛选 */}
            <Grid item xs style={{ marginLeft: "16px" }}>
              <Button
                variant="outlined"
                onClick={handlePriceClick}
                sx={{
                  borderWidth: "1px",
                  borderRadius: "4px",
                  textTransform: "none",
                  height: "56px",
                  padding: "6px 16px",
                  "&:hover": {
                    borderColor: "primary.main",
                  },
                }}
              >
                Price Range: ${selectedPriceRange[0]} - ${selectedPriceRange[1]}
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={priceAnchorEl}
                onClose={handlePriceClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Box p={3}>
                  <Typography>Adjust Price Range</Typography>
                  <Slider
                    value={selectedPriceRange}
                    onChange={(event, newValue) => {
                      setSelectedPriceRange(newValue);
                    }}
                    valueLabelDisplay="auto"
                    min={priceLimits.min}
                    max={priceLimits.max}
                  />
                </Box>
              </Popover>
            </Grid>
            {/* 排序 */}
            <Grid item style={{ marginLeft: "auto" }}>
              <Button
                aria-describedby={sortAnchorEl ? "sort-popover" : undefined}
                variant="contained"
                onClick={handleSortClick}
              >
                Sort
              </Button>
              <Popover
                id="sort-popover"
                open={Boolean(sortAnchorEl)}
                anchorEl={sortAnchorEl}
                onClose={handleSortClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Box p={2}>
                  {/* <Typography variant="h6">Sort By</Typography> */}
                  <MenuItem
                    onClick={() => {
                      setSortOption("Lowest Price");
                      handleSortClose();
                    }}
                  >
                    Lowest Price
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSortOption("Highest Price");
                      handleSortClose();
                    }}
                  >
                    Highest Price
                  </MenuItem>
                </Box>
              </Popover>
            </Grid>
          </Grid>
        </Container>
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <Grid container sx={{ height: "100%", maxHeight: "100%" }}>
            <Grid item xs={12} md={8} sx={{ height: "100%" }}>
              <LoadScript googleMapsApiKey="AIzaSyDNvm9qmRm_qIhkcY9ryTzuVCciCSTmrvg">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={defaultCenter}
                  zoom={14}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  onIdle={handleBoundsChange}
                  options={{
                    styles: mapStyles,
                  }}
                >
                  {displayedListings.map((listing, index) => (
                    <MarkerF
                      key={index}
                      position={{
                        lat: listing.latitude,
                        lng: listing.longitude,
                      }}
                      onMouseOver={() => handleActiveMarker(index)}
                      onMouseOut={() => handleActiveMarker(null)}
                    >
                      {activeMarker === index ? (
                        <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                          <Box>
                            <Typography variant="subtitle2">
                              {listing.title}
                            </Typography>
                            <Typography variant="body2">
                              {listing.description}
                            </Typography>
                            <Typography variant="body2">{`$${listing.floorPlans[0].price} / month`}</Typography>
                          </Box>
                        </InfoWindowF>
                      ) : null}
                    </MarkerF>
                  ))}
                </GoogleMap>
              </LoadScript>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ height: "100%", overflowY: "auto" }}
            >
              <Grid container spacing={2} sx={{ padding: 2 }}>
                {currentListings.map((listing, index) => (
                  <ListingCard key={index} listing={listing} />
                ))}
              </Grid>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handleChangePage}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </UserProvider>
  );
}

function LoginDialog({ open, onClose, setUser }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // 用于注册的邮箱状态
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 确认密码状态
  const [isLogin, setIsLogin] = useState(true);
  const [, setError] = useState("");

  const handleLogin = async () => {
    try {
      const loginData = { username, password };
      const response = axios.post(apiUrl + "/housing/users/login", loginData);
      console.log("Login success:", response.data);
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "Login failed");
    }
  };

  // 注册逻辑...
  const handleRegister = () => {
    // 检查密码和确认密码是否匹配
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userData = { username, email, password };
      const response = axios.post(apiUrl + "/housing/users/register", userData);
      console.log("Registration success:", response.data);
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      onClose();
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // 切换表单时清空所有字段
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isLogin ? "Login" : "Register"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          type="text"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {!isLogin && (
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={isLogin ? handleLogin : handleRegister}>
          {isLogin ? "Login" : "Register"}
        </Button>
        <Button color="primary" onClick={toggleForm}>
          {isLogin ? "Register" : "Have an account? Login"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ListingCard({ listing }) {
  // 解构必要的属性
  const { title, address, source, floorPlans } = listing;

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
        </CardActions>
      </Card>
    </Grid>
  );
}

export default App;
