import {Box, Typography} from "@mui/material";

export const EmptyList = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flex: 1,
        marginTop: "25vh",
        marginLeft: "5vw",
        marginRight: "5vw",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" pb={5}>
        Your library is empty
      </Typography>
      <Typography variant="h5">
        Get started by adding songs from the search or new releases section
      </Typography>
    </Box>
  );
};
