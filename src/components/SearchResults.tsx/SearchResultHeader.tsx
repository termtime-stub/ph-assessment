import {Divider, Grid, Theme} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {makeStyles, createStyles} from "@mui/styles";
import {useAppSelector} from "../../app/hooks";
import {NoSearch} from "./NoSearch";

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
      padding: 10,
    },
  })
);

export const SearchResultHeader = () => {
  const styles = useStyles();
  const {results} = useAppSelector((state) => state.search);

  if (results.length === 0) {
    return <NoSearch />;
  }
  return (
    <Box>
      <Grid columns={7} container className={styles.container}>
        <Grid item xs={1} className={styles.col}>
          <Typography variant="subtitle1"></Typography>
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
