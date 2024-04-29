import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import { useState } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

export function EditListingForm({
  open,
  onClose,
  listing,
  onSave,
  onSnackbarOpen,
}) {
  //  Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!listing.propertyID) {
      onSnackbarOpen("No property ID provided for deletion.", "error");
      return;
    }
    const url = `/housing/property/properties/delete/${listing.propertyID}`;
    const requestOptions = {
      method: "DELETE",
    };

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.text();
      if (result !== "OK") {
        throw new Error(`Server responded with an error: ${result}`);
      }
      onSnackbarOpen("Property deleted successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Failed to delete property:", error);
      onSnackbarOpen("Failed to delete property. Please try again.", "error");
    }
    setDeleteConfirmOpen(false); // 关闭确认对话框
  };

  // Form Data
  const [formData, setFormData] = useState({
    ...listing,
    currentFloorPlanIndex: 0,
    floorPlans: listing.floorPlans || [
      {
        bedrooms: "",
        bathrooms: "",
        price: "",
        petsAllowed: "None",
      },
    ], // 确保始终有至少一个楼层平面图
  });
  const addFloorPlan = () => {
    const newFloorPlan = {
      bedrooms: "",
      bathrooms: "",
      price: "",
      petsAllowed: "None",
    };
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

  const removeCurrentFloorPlan = () => {
    if (formData.currentFloorPlanIndex > 0 && formData.floorPlans.length > 1) {
      const newFloorPlans = formData.floorPlans.filter(
        (_, index) => index !== formData.currentFloorPlanIndex
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        floorPlans: newFloorPlans,
        currentFloorPlanIndex: Math.max(0, formData.currentFloorPlanIndex - 1),
      }));
    }
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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDNvm9qmRm_qIhkcY9ryTzuVCciCSTmrvg",
  });

  const submitForm = async () => {
    // 判断是添加还是更新
    const isAdding = !formData.propertyID; // 如果没有 propertyID，视为添加
    const url = isAdding
      ? `/housing/property/properties/create`
      : `/housing/property/properties/update/`;

    const requestBody = {
      ...(isAdding ? {} : { propertyID: formData.propertyID }), // 添加时不包含 propertyID
      address: formData.address || "null",
      amenities: formData.amenities || "null",
      contactNumber: formData.contactNumber || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      source: formData.source || "admin",
      state: formData.state || "IL",
      cityName: formData.cityName || "Urbana",
      category: formData.category || "housing/rent/apartment",
      title: formData.title,
      description: formData.description,
      time: formData.time || new Date().toISOString(), // 如果是添加，使用当前时间
      floorPlans: formData.floorPlans.map((plan) => ({
        ...(plan.floorPlanID ? { floorPlanID: plan.floorPlanID } : {}), // 只在编辑时包含 floorPlanID
        bedrooms: plan.bedrooms,
        bathrooms: plan.bathrooms,
        squareFeet: plan.squareFeet,
        price: plan.price,
        currency: plan.currency || "USD",
        fee: plan.fee || 0,
        hasPhoto: plan.hasPhoto || false,
        petsAllowed: plan.petsAllowed || "None",
      })),
    };

    const requestOptions = {
      method: isAdding ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.text();
      if (result !== "OK") {
        onSnackbarOpen(result, "error");
      } else {
        console.log("Submission successful:", result);
        if (isAdding) {
          onSnackbarOpen("Property added successfully!", "success");
        } else {
          onSnackbarOpen("Property updated successfully!", "success");
        }
        onSave(formData);
        onClose();
      }
    } catch (error) {
      console.error("Failed to submit listing:", error);
      if (isAdding) {
        onSnackbarOpen("Failed to add property. Please try again.", "error");
      } else {
        onSnackbarOpen("Failed to update property. Please try again.", "error");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Edit Listing{" "}
        <IconButton
          color="error"
          onClick={handleDelete}
          sx={{
            position: "absolute", // 定位到标题栏
            top: 8, // 距离顶部8像素
            right: 8, // 距离右侧8像素
          }}
        >
          <DeleteIcon />
        </IconButton>
      </DialogTitle>
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
          label="Pets Allowed"
          name="petsAllowed"
          value={currentFloorPlan.petsAllowed}
          onChange={(e) =>
            handleFloorPlanChange(
              formData.currentFloorPlanIndex,
              "petsAllowed",
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
            {formData.currentFloorPlanIndex > 0 && (
              <IconButton onClick={removeCurrentFloorPlan} color="error">
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
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
            <Button onClick={submitForm} color="primary">
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Box>
        </Box>
      </DialogContent>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this property?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>No</Button>
          <Button onClick={confirmDelete} color="error">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
