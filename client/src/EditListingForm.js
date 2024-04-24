import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // 引入加号图标
import Box from "@mui/material/Box";
import { useState } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

export function EditListingForm({ open, onClose, listing, onSave }) {
  const [formData, setFormData] = useState({
    ...listing,
    currentFloorPlanIndex: 0,
    floorPlans: listing.floorPlans || [{}], // 确保始终有至少一个楼层平面图
  });
  const addFloorPlan = () => {
    const newFloorPlan = { bedrooms: "", bathrooms: "", price: "" }; // 根据需要调整默认字段
    const updatedFloorPlans = [...formData.floorPlans, newFloorPlan];
    setFormData({ ...formData, floorPlans: updatedFloorPlans });
    handleChangeFloorPlanIndex(updatedFloorPlans.length - 1);
  };

  // 切换楼层平面图索引
  const handleChangeFloorPlanIndex = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      currentFloorPlanIndex: index,
    }));
  };
  // 更新表单数据的方法
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    onClose();
  };

  const handleFloorPlanChange = (index, field, value) => {
    const updatedFloorPlans = [...formData.floorPlans];
    updatedFloorPlans[index] = { ...updatedFloorPlans[index], [field]: value };
    setFormData({ ...formData, floorPlans: updatedFloorPlans });
  };

  const currentFloorPlan = formData.floorPlans[formData.currentFloorPlanIndex];

  // 更新地图位置
  const handleMapClick = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDNvm9qmRm_qIhkcY9ryTzuVCciCSTmrvg",
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Listing</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Contact Number"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
        />
        {/* 其他表单元素 */}
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "300px" }}
            center={{ lat: formData.latitude, lng: formData.longitude }}
            onClick={handleMapClick}
            zoom={15}
          >
            <MarkerF
              position={{ lat: formData.latitude, lng: formData.longitude }}
            />
          </GoogleMap>
        )}
        {/* FloorPlan Details */}
        <Typography variant="h6" gutterBottom>
          Floor Plan {formData.currentFloorPlanIndex + 1}
        </Typography>
        <TextField
          fullWidth
          label="Bedrooms"
          type="number"
          value={currentFloorPlan.bedrooms}
          onChange={(e) =>
            handleFloorPlanChange(
              formData.currentFloorPlanIndex,
              "bedrooms",
              e.target.value
            )
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Bathrooms"
          type="number"
          value={currentFloorPlan.bathrooms}
          onChange={(e) =>
            handleFloorPlanChange(
              formData.currentFloorPlanIndex,
              "bathrooms",
              e.target.value
            )
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Price"
          type="number"
          value={currentFloorPlan.price}
          onChange={(e) =>
            handleFloorPlanChange(
              formData.currentFloorPlanIndex,
              "price",
              e.target.value
            )
          }
          margin="normal"
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <IconButton
              onClick={() =>
                handleChangeFloorPlanIndex(
                  Math.max(formData.currentFloorPlanIndex - 1, 0)
                )
              }
              disabled={formData.currentFloorPlanIndex === 0}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton onClick={addFloorPlan}>
              <AddCircleOutlineIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                handleChangeFloorPlanIndex(
                  Math.min(
                    formData.currentFloorPlanIndex + 1,
                    formData.floorPlans.length - 1
                  )
                )
              }
              disabled={
                formData.currentFloorPlanIndex ===
                formData.floorPlans.length - 1
              }
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
          <Box>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
