import {Box} from "@mui/material";

import {NavBar} from "../../components/NavBar";
import {NewReleases} from "../../components/NewReleases/NewReleases";
import {SearchResults} from "../../components/SearchResults.tsx/SearchResults";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";
import {useAppSelector, useAppDispatch} from "../../app/hooks";
import {getLibraryAction} from "../../app/redux/reducers/library.reducer";
import {getNewReleasesAction} from "../../app/redux/reducers/search.reducer";
import {useSnackbar} from "notistack";

export const DashboardPage = () => {
  const {user} = useAuth0();
  const {songs} = useAppSelector((state) => state.library);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initialFetch = async () => {
      if (user && songs.length === 0) {
        if (songs.length === 0) {
          await dispatch(getLibraryAction({user}));
        }
        dispatch(getNewReleasesAction(user));
      }
    };

    initialFetch();
  }, [dispatch, songs.length, user]);
  return (
    <Box>
      <NavBar />
      <NewReleases />
      <SearchResults />
    </Box>
  );
};
