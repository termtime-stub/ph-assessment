import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";

export const LoadingRow = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: "50px",
      }}
    >
      <CircularProgress color="secondary" />
    </Box>
  );
};
