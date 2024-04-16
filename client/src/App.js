import React from 'react';
import { AppBar, Toolbar, Typography, Box, Grid, Paper, Card, CardMedia, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Container } from '@mui/material';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';


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
    imageUrl: "https://lh3.googleusercontent.com/p/AF1QipOwn4Z-sKZmtfF0y-ZYcqKoFB3w_7ubmBpVKoGV=s680-w680-h510", // 替换为房产图片的URL
    lat: 40.11291900531373,
    lng: -88.23440746931675
  },
  // ...更多房产数据
];

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NextHousing
          </Typography>
          <Button color="inherit">LOGIN</Button>
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
                />
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
