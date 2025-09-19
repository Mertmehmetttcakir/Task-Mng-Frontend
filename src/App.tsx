import React from "react";
import { Container, Typography } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router/AppRouter";
function App() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
      </Typography>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Container>
  );
}

export default App;
