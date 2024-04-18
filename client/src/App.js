import React, { useState,useRef } from 'react';
import { AppBar, Toolbar, Typography, Box, Grid, Pagination , Card, CardMedia, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Container,Dialog, DialogTitle, DialogContent, DialogActions, CardActions, IconButton } from '@mui/material';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Scale } from '@mui/icons-material';

const mapStyles = [
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)'
};

const defaultCenter = {
  lat: 40.1019523,
  lng: -88.2297364
};

const addressCache = {};

function App() {
  const [activeMarker, setActiveMarker] = useState(null);
  // 翻页相关
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };


  // 处理Marker悬停事件
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
  const [listings, setListings] = useState([]);
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
      maxLongitude: ne.lng()
    };

    setBounds(latLngBounds);
    fetchListings(latLngBounds);
  };



  const fetchAddress = async (latitude, longitude) => {
    
    const latLngKey = `${latitude},${longitude}`;
    if (addressCache[latLngKey]) {
      // console.log("Address found in cache");
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
      
      // 创建一个新的数组来保存包含地址信息的房产列表
      const updatedListings = await Promise.all(data.map(async (listing) => {
        // 如果房产对象没有地址信息，则调用 fetchAddress 函数获取
        if (listing.address === 'null') {
          listing.address = await fetchAddress(listing.latitude, listing.longitude);
        }
        return listing;
      }));
      
      setListings(updatedListings);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      // 处理错误，可能是设置一个状态来显示错误信息
    }
  };

  const listingsPerPage = 10;
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.ceil(listings.length / listingsPerPage);
  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NextHousing
          </Typography>
          <Button color="inherit" onClick={handleLoginClick}>LOGIN</Button>
          <LoginDialog open={dialogOpen} onClose={handleDialogClose} />
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ paddingY: 1 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={2}>
            <Dropdown label="Campus or Town" />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Dropdown label="Price" />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Dropdown label="Pricing Type" />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Dropdown label="Beds & Baths" />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Dropdown label="Building Type" />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Dropdown label="More" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Search" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Dropdown label="Sort" />
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%', maxHeight: '100%' }}>
          <Grid item xs={12} md={8} sx={{ height: '100%' }}>
            <LoadScript googleMapsApiKey="AIzaSyDNvm9qmRm_qIhkcY9ryTzuVCciCSTmrvg">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={14}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onIdle={handleBoundsChange}
                options={{
                  styles: mapStyles 
                }}
              >
                {listings.map((listing, index) => (
                  <MarkerF
                    key={index}
                    position={{ lat: listing.latitude, lng: listing.longitude }}
                    onMouseOver={() => handleActiveMarker(index)}
                    onMouseOut={() => handleActiveMarker(null)}
                  >
                    {activeMarker === index ? (
                      <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                        <Box>
                          <Typography variant="subtitle2">{listing.title}</Typography>
                          <Typography variant="body2">{listing.description}</Typography>
                          <Typography variant="body2">{`$${listing.floorPlans[0].price} / month`}</Typography>
                        </Box>
                      </InfoWindowF>
                    ) : null}
                  </MarkerF>
                ))}
              </GoogleMap>
            </LoadScript>
          </Grid>
          <Grid item xs={12} md={4} sx={{ height: '100%', overflowY: 'auto' }}>
            <Grid container spacing={2} sx={{ padding: 2 }}>
              {currentListings.map((listing, index) => (
                <ListingCard key={index} listing={listing} />
              ))}
            </Grid>
            <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
  
}

function LoginDialog({ open, onClose }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // 用于注册的邮箱状态
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 确认密码状态
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => {
    // 登录逻辑...
    onClose();
  };

  const handleRegister = () => {
    // 注册逻辑...
    // 在这里你可能想检查密码和确认密码是否匹配
    // 以及是否输入了有效的邮箱
    onClose();
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // 切换表单时清空所有字段
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isLogin ? 'Login' : 'Register'}</DialogTitle>
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
            type="email"
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
          {isLogin ? 'Login' : 'Register'}
        </Button>
        <Button color="primary" onClick={toggleForm}>
          {isLogin ? 'Register' : 'Have an account? Login'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function Dropdown({ label }) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select label={label} defaultValue="">
        <MenuItem value="">None</MenuItem>
        {/* 添加更多的MenuItem组件来代表不同的选项 */}
      </Select>
    </FormControl>
  );
}


function ListingCard({ listing }) {
  // 解构必要的属性
  const {
    title,
    address,
    source,
    floorPlans
  } = listing;

  const getBedBathString = (floorPlans) => {
    if (floorPlans.length === 1) {
      const singlePlan = floorPlans[0];
      return `${singlePlan.bedrooms} Bed | ${singlePlan.bathrooms} Bath`;
    }
    const beds = floorPlans.map(fp => fp.bedrooms);
    const baths = floorPlans.map(fp => fp.bathrooms);
    return `${Math.min(...beds)}-${Math.max(...beds)} Beds | ${Math.min(...baths)}-${Math.max(...baths)} Baths`;
  };

  // Updated function to handle a single price
  const getPriceRange = (floorPlans) => {
    if (floorPlans.length === 1) {
      return `$${floorPlans[0].price}`;
    }
    const prices = floorPlans.map(fp => fp.price);
    return `$${Math.min(...prices)} - $${Math.max(...prices)}`;
  };


  // 获取卧室和浴室描述
  const bedBathStr = getBedBathString(floorPlans);

  // 获取价格范围描述
  const priceRange = getPriceRange(floorPlans);

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
          <Typography gutterBottom variant="h7" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {address || "Fetching address..."}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {bedBathStr}
          </Typography>
          <Typography variant="body1">
            {priceRange}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">Email Property</Button>
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
