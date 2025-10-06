import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import Snackbar from "@mui/material/Snackbar";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Authentication() {
  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState(0); // 0 = Sign In, 1 = Sign Up
  const [open, setOpen] = useState(false);




  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors
    try {
      if (formState === 1) {
        // Sign Up
        const result = await handleRegister(userName, email, password);
        setMessage(result.message || "Registration successful");
      } else {
        // Sign In
        const result = await handleLogin(email, password);
        setMessage(result.message || "Login successful");
      }
      // reset form fields
      setUserName("");
      setEmail("");
      setPassword("");
      setFormState(0);
      setOpen(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
  setError(msg);
    }
  };

  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ width: 600 }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <div style={{ display: "flex", margin: "20px" }}>
              <Button
                variant={formState === 0 ? "contained" : ""}
                onClick={() => setFormState(0)}
              >
                Sign IN
              </Button>
              <Button
                variant={formState === 1 ? "contained" : ""}
                onClick={() => setFormState(1)}
              >
                Sign Up
              </Button>
            </div>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              {formState === 1 ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="userName"
                  value={userName}
                  label="User Name"
                  name="userName"
                  autoFocus
                  onChange={(e) => setUserName(e.target.value)}
                />
              ) : (
                <></>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                value={password}
                label="Password"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              

              {formState === 1 ? (
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  Sign Up
                </Button>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSubmit}
                >
                  Sign In
                </Button>
              )}

              <Snackbar
                open={open}
                autoHideDuration={3000}
                message={message}
                onClose={() => setOpen(false)}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
