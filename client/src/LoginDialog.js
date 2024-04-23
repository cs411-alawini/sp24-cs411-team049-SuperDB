import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import axios from "axios";

function LoginDialog({ open, onClose, setUser }) {
    const apiUrl = 'http://localhost:8080'; 
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); // 用于注册的邮箱状态
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // 确认密码状态
    const [isLogin, setIsLogin] = useState(true);
    const [, setError] = useState("");
  
    const handleLogin = async () => {
      try {
        const loginData = { username, password };
        console.log('API URL:', `${apiUrl}/housing/users/login`);
        const response = await axios.post(`${apiUrl}/housing/users/login`, loginData);
  
        console.log('Login success:', response.data);
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        onClose();
      } catch (error) {
        console.error("Login failed:", error);
        setError(error.response?.data?.message || "Login failed");
      }
    };
  
    // 注册逻辑...
    const handleRegister = async () => {
      // 检查密码和确认密码是否匹配
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
  
      try {
        const userData = { username, email, password };
        console.log('API URL:', `${apiUrl}/housing/users/register`);
        const response = await axios.post(`${apiUrl}/housing/users/register`, userData);
        console.log('Registration success:', response.data);
  
        console.log(setUser);
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        onClose();
      } catch (error) {
        console.error("Registration failed:", error);
        console.error(error.response);
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
  
export default LoginDialog;
