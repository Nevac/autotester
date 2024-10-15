import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainView from "./views/main.view";
import {createTheme, CssBaseline, GlobalStyles, makeStyles, ThemeProvider} from "@mui/material";
import Paper from "@mui/material/Paper";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <MainView/>
    ),
  }
]);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
    return (
      <ThemeProvider theme={darkTheme}>
          <CssBaseline/>
          <GlobalStyles
              styles={{
                  "::-webkit-scrollbar": {
                      width: "8px",
                  },
                  "::-webkit-scrollbar-track": {
                      backgroundColor: "rgba(0,0,0,0)",
                  },
                  "::-webkit-scrollbar-thumb": {
                      backgroundColor: "grey",
                      borderRadius: "10px",
                  },
                  "::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#888",
                  },
              }}
          />
        <Paper
            className="App"
            elevation={0}>
          <RouterProvider router={router}/>
        </Paper>
      </ThemeProvider>
  );
}

export default App;
