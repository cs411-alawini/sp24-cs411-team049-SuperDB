import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Grid, Paper, Card, CardMedia, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Container,Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';


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
      </Box>
      <Grid container>
        <Grid item xs={12} md={9}>
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
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ maxHeight: '100vh', overflow: 'auto' }}>
            {listings.map((listing, index) => (
              <ListingCard key={index} {...listing} />
            ))}
          </Paper>
        </Grid>
      </Grid>
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


function ListingCard({ title, address, price, imageUrl }) {
  return (
    <Card sx={{ display: 'flex', marginBottom: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={imageUrl}
        alt="House"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6">
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {address}
          </Typography>
          <Typography variant="body1" component="div">
            {`$${price} / month`}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

export default App;
