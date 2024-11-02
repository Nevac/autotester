import React from 'react';
import './App.css';
import MainView from "./views/main/main.view";
import {createTheme, CssBaseline, GlobalStyles, ThemeProvider} from "@mui/material";
import Paper from "@mui/material/Paper";
import {Provider} from "react-redux";
import {store} from './app/store'


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
    return (
        <Provider store={store}>
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
                    <MainView/>
                </Paper>
            </ThemeProvider>
        </Provider>

    );
}

export default App;
