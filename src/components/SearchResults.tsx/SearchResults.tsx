import {List} from "@mui/material";
import Box from "@mui/material/Box";

import {makeStyles, createStyles} from "@mui/styles";
import {useAppSelector} from "../../app/hooks";
import {SearchResultHeader} from "./SearchResultHeader";
import {SongListItem} from "./SongListItem";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      marginLeft: 50,
      marginRight: 50,
    },
  })
);

export const SearchResults = () => {
  const {results} = useAppSelector((state) => state.search);
  const styles = useStyles();

  return (
    <Box className={styles.container}>
      <SearchResultHeader />
      <List>
        {results.map((s) => (
          <SongListItem key={s.id} song={s} />
        ))}
      </List>
    </Box>
  );
};
