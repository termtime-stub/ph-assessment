import {Box} from "@mui/material";

import {NavBar} from "../../components/NavBar";
import {NewReleases} from "../../components/NewReleases/NewReleases";
import {SearchResults} from "../../components/SearchResults.tsx/SearchResults";

export const DashboardPage = () => {
  return (
    <Box>
      <NavBar />
      <NewReleases />
      <SearchResults />
    </Box>
  );
};
