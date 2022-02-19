import {List} from "@mui/material";
import Box from "@mui/material/Box";

import {useAppSelector} from "../../app/hooks";
import {SearchResultHeader} from "./SearchResultHeader";
import {SongListItem} from "./SongListItem";

export const SearchResults = () => {
  const {results} = useAppSelector((state) => state.search);

  return (
    <Box
      sx={{
        marginLeft: {xs: 0, md: "50px"},
        marginRight: {xs: 0, md: "50px"},
      }}
    >
      <SearchResultHeader />
      <List>
        {results.map((s) => (
          <SongListItem key={s.id} song={s} />
        ))}
      </List>
    </Box>
  );
};
