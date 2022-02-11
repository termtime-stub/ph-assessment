import {Box, Typography} from "@mui/material";

import {makeStyles, createStyles} from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
    },
    text: {
      textAlign: "center",
    },
  })
);

export const NoSearch = () => {
  const styles = useStyles();
  return (
    <Box className={styles.container}>
      <Typography className={styles.text} variant="h5">
        Search results will be shown here, start searching!
      </Typography>
    </Box>
  );
};
