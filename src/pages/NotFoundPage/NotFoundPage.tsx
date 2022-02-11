import {Box, Typography, Divider} from "@mui/material";
import {Link} from "react-router-dom";
import {APP_ROUTES} from "../../constants/index";

import {makeStyles, createStyles} from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    center: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      justifyContent: "center",
    },
    link: {
      textDecoration: "none",
      color: "#AAA",

      transitionDuration: "0.2s",
      "&:hover": {
        color: "#EEE",
      },
    },
  })
);
export const NotFoundPage = () => {
  const styles = useStyles();
  return (
    <Box className={styles.center}>
      <Typography variant="h2" textAlign="center">
        The page you are looking for does not exist!
      </Typography>
      <Divider sx={{mr: 15, ml: 15}} color="primary" />
      <Typography sx={{mt: 5}} variant="h3" textAlign="center">
        <Link className={styles.link} to={APP_ROUTES.ROOT}>
          Back to home
        </Link>
      </Typography>
    </Box>
  );
};
