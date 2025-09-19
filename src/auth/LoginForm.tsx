import React from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { authStore } from "../stores/authStore";
import {
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Divider
} from "@mui/material";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const LoginForm: React.FC = observer(() => {
  const [emailInput, setEmailInput] = React.useState("");
  const [remember, setRemember] = React.useState(authStore.rememberMe);
      const navigate = useNavigate();


  const isValidEmail = emailRegex.test(emailInput.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail)  return;
    await authStore.loginAsync(emailInput.trim());
    if (authStore.isLoggedIn) {
      navigate("/tasks");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmailInput(val);
    if (authStore.error) {
      authStore.clearError(); 
    }
  };
  const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.checked;
    setRemember(v);
    authStore.setRememberMe(v); 
  };

  if (authStore.isLoggedIn) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ p: 4, minWidth: 360 }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h5">Hoşgeldiniz, {authStore.name || authStore.email}!</Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {authStore.email}
            </Typography>
            {authStore.departmentName && (
              <Typography variant="body2" color="text.secondary">
                Departman: {authStore.departmentName}
              </Typography>
            )}
            <Divider flexItem />
            <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => authStore.logout()}
              >
                Çıkış Yap
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">Giriş Yap</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Task Manager'a Hoşgeldiniz
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Devam etmek için email adresinizi giriniz
              </Typography>
            </Stack>

            <TextField
              label="Email"
              type="email"
              value={emailInput}
              onChange={handleEmailChange}
              fullWidth
              required
              disabled={authStore.isLoading}
              autoComplete="email"
              autoFocus
              error={emailInput !== "" && !isValidEmail}
              helperText={
                authStore.isLoading
                  ? "Lütfen bekleyin..."
                  : emailInput !== "" && !isValidEmail ? "Geçersiz email adresi" : " "
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={handleRememberChange}
                  size="small"
                />
              }
              label={<Typography variant="body2">Beni Hatırla</Typography>}
            />

            {authStore.error && (
              <Alert severity="error" variant="outlined">
                {authStore.error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={authStore.isLoading || emailInput.trim() === ""}
              startIcon={
                authStore.isLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {authStore.isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
});

export default LoginForm;
