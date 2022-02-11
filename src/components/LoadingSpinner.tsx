import {ComponentStyleSheet} from "../types/ComponentStyleSheet";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const style = ComponentStyleSheet.create({
  spinner: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "#201640",
  },
});

export const LoadingSpinner = () => {
  return (
    <Box style={style.container}>
      <Box style={style.spinner}>
        <CircularProgress />
      </Box>
    </Box>
  );
};
