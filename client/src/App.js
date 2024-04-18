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

  const fetchListings = async (bounds) => {
    const url = `/housing/property/properties/inRectangle?minLatitude=${bounds.minLatitude}&maxLatitude=${bounds.maxLatitude}&minLongitude=${bounds.minLongitude}&maxLongitude=${bounds.maxLongitude}`;
    const response = await fetch(url);
    const data = await response.json();
    setListings(data);
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
                <ListingCard key={index} {...listing} />
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


function ListingCard({ title, address, price, imageUrl, isFavourite = false}) {
  // 定义卡片和媒体部分的样式
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 400, // 可以调整为所需的固定高度
    margin: '8px'
  };

  const mediaStyle = {
    height: '60%', // 图片高度占卡片的60%
  };

  const handleFavouriteClick = () => {
    // 这里你可以添加逻辑来更新用户的收藏状态
    console.log(`${title} is favourited: ${!isFavourite}`);
  };

  return (
    <Grid item xs={12} sm={6} md={6} lg={6}>
      <Card sx={cardStyle}>
        <CardMedia
          component="img"
          sx={mediaStyle}
          image={imageUrl}
          alt="House"
        />
        <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography gutterBottom variant="h6" component="div">
              {title}
            </Typography>
            <IconButton onClick={handleFavouriteClick}>
              <FavoriteBorderIcon color={isFavourite ? "error" : "action"} />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {address}
          </Typography>
          <Typography variant="body1">
            {`$${price} / month`}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">Email Property</Button>
          <Button size="small" color="primary">Call</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}



export default App;
