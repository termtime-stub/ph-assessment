import {Divider, Grid, Theme} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {makeStyles, createStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      borderBottomColor: "#302c3a",
      borderBottomWidth: 10,
      marginBottom: 2,
    },
    text: {
      color: "#a7a7a7",
      fontWeight: "bolder",
    },
    col: {
      display: "flex",
      flexDirection: "column",
      borderBottomColor: "#302c3a",
      borderBottomWidth: 10,
    },
  })
);

export const SearchResultHeader = () => {
  const styles = useStyles();
  return (
    <Box>
      <Grid columns={7} container className={styles.container}>
        <Grid item xs={1} className={styles.col}>
          <Typography variant="subtitle1">#</Typography>
        </Grid>
        <Grid item xs={2} className={styles.col}>
          <Typography variant="subtitle1">Title</Typography>
        </Grid>
        <Grid item xs={2} className={styles.col}>
          <Typography variant="subtitle1">Album</Typography>
        </Grid>
        <Grid item xs={1} className={styles.col}>
          <Typography variant="subtitle1">Duration</Typography>
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
};
