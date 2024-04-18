import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Grid, Card, CardMedia, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Container,Dialog, DialogTitle, DialogContent, DialogActions, CardActions, IconButton } from '@mui/material';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { UserProvider } from './UserContext';

import axios from 'axios';

const mapStyles = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 40.1019523,
  lng: -88.2297364
};

// 模拟房产数据
const listings = [
  {
    title: "Icon Apartment",
    address: "309 E Springfield Ave, Champaign, IL 61820",
    price: 1850,
    imageUrl: "https://images1.apartments.com/i2/8iVWI77Npzj1eSM9GPJkGpoEjdDoL3lVq1yYtDuE64w/111/icon---brand-new-champaign-il-primary-photo.jpg", // 替换为房产图片的URL
    lat: 40.11291900531373,
    lng: -88.23440746931675
  },
    {
    title: "The Dean Campustown",
    address: "102 E Green St, Champaign, IL 61820",
    price: 1850,
    imageUrl: "https://images1.apartments.com/i2/xFgpZiNB_QogH4M73YcTpVIqEB35vcuwp8zeQ7k68TA/111/the-dean-campustown-champaign-il-9444-2.jpg", // 替换为房产图片的URL
    lat: 40.1065968,
    lng: -88.2330653
  },
  // ...更多房产数据
];

function App() {
  const [activeMarker, setActiveMarker] = useState(null);
  
  const campusOptions = [
    { value: 'Champaign', label: 'Champaign' },
    { value: 'Urbana', label: 'Urbana' }
  ];

  const pricingOptions = [
    { value: '600', label: '600' },
    { value: '1000', label: '1000' },
    { value: '1400', label: '1400' }
  ];

  const pricingTypeOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const bedsBathsOptions = [
    { value: '1b1b', label: '1 Bed 1 Bath' },
    { value: '2b1b', label: '2 Bed 1 Bath' }
  ];

  const buildingTypeOptions = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' }
  ];

  const moreOptions = [
    { value: 'gym', label: 'Gym' },
    { value: 'pool', label: 'Pool' }
  ];

  const sortOptions = [
    { value: 'priceLowToHigh', label: 'Price: Low to High' },
    { value: 'priceHighToLow', label: 'Price: High to Low' }
  ];

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

  return (
    <UserProvider>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              NextHousing
            </Typography>
            <Button color="inherit" onClick={handleLoginClick}>LOGIN</Button>
            <LoginDialog open={dialogOpen} onClose={handleDialogClose} />
          </Toolbar>
        </AppBar>
        <Box sx={{ width: '100%', backgroundColor: 'white' }}>
          <Container maxWidth={false}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} sm={2}>
                <Dropdown label="Campus or Town" options={campusOptions} />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Dropdown label="Price" options={pricingOptions} />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Dropdown label="Pricing Type" options={pricingTypeOptions} />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Dropdown label="Beds & Baths" options={bedsBathsOptions} />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Dropdown label="Building Type" options={buildingTypeOptions} />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Dropdown label="More" options={moreOptions} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Search" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Dropdown label="Sort" options={sortOptions} />
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Grid container>
          <Grid item xs={12} md={8}>
            <LoadScript googleMapsApiKey="AIzaSyDNvm9qmRm_qIhkcY9ryTzuVCciCSTmrvg">
              <GoogleMap
                mapContainerStyle={mapStyles}
                center={defaultCenter}
                zoom={14}
              >
                {listings.map((listing, index) => (
                  <MarkerF
                    key={index}
                    position={{ lat: listing.lat, lng: listing.lng }}
                    onMouseOver={() => handleActiveMarker(index)} // 当鼠标悬停时设置激活的Marker
                    onMouseOut={() => handleActiveMarker(null)} // 当鼠标离开时关闭信息窗口
                  >
                                    {/* 如果当前marker是激活的，显示InfoWindow */}
                  {activeMarker === index ? (
                    <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                      <Box>
                        <Typography variant="subtitle2">{listing.title}</Typography>
                        <Typography variant="body2">{listing.address}</Typography>
                        <Typography variant="body2">{`$${listing.price} / month`}</Typography>
                      </Box>
                    </InfoWindowF>
                  ) : null}
                </MarkerF>
                ))}
              </GoogleMap>
            </LoadScript>
          </Grid>
          <Grid item xs={12} md={4} sx={{ overflow: 'auto' }}>
            <Grid container spacing={2} sx={{ padding: 2 }}>
              {listings.map((listing, index) => (
                <ListingCard key={index} {...listing} />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </UserProvider>
  );
  
}

function LoginDialog({ open, onClose, setUser }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // 用于注册的邮箱状态
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 确认密码状态
  const [isLogin, setIsLogin] = useState(true);
  const [, setError] = useState('');

  const handleLogin = async () => {
    try {
      const loginData = { username, password };
      const response = axios.post(apiUrl + '/housing/users/login', loginData);
      console.log('Login success:', response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed');
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
      const response = axios.post(apiUrl + '/housing/users/register', userData);
      console.log('Registration success:', response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      onClose();
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // 切换表单时清空所有字段
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isLogin ? 'Login' : 'Register'}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Username" type="text" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
        {!isLogin && (
          <TextField margin="dense" label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        )}
        <TextField margin="dense" label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
        {!isLogin && (
          <TextField margin="dense" label="Confirm Password" type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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


function Dropdown({ label, options }) {
  const items = options || [];

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select label={label} defaultValue="">
        {items.length > 0 ? (
          items.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">None</MenuItem>
        )}
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
