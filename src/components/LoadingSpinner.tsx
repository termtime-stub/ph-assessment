import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {makeStyles, createStyles} from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    spinner: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      justifyContent: "center",
    },
  })
);

export const LoadingSpinner = () => {
  const styles = useStyles();
  return (
    <Box>
      <Box className={styles.spinner}>
        <CircularProgress color="secondary" />
      </Box>
    </Box>
  );
};
