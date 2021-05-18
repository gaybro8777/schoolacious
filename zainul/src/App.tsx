import React from "react";
import { useState } from "react";
import {
  ThemeProvider,
  createMuiTheme,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";

const theme = createMuiTheme({
  props: {
    MuiButtonBase: { disableRipple: true },
    MuiButton: { disableElevation: true },
  },
  overrides: {
    MuiButtonBase: {
      root: {
        "&:active": {
          transition: "all 250ms ease",
          filter: "brightness(1.12)",
          transform: "scale(0.92)",
        },
      },
    },
  },
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container alignItems="center" direction="column" justify="center">
          {/* header of the counter */}
          <Typography variant="h1">Counter React</Typography>
          <Typography variant="h3">The count is {count}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCount(count + 1)}
          >
            Click
          </Button>
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default App;
