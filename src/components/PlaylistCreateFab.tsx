import {Box, Fab, Tooltip, Typography} from "@mui/material";

export interface BottomRightFabProps {
  tooltipText: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const PlaylistCreateFab = ({
  tooltipText,
  icon,
  onClick,
}: BottomRightFabProps) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: (theme) => theme.spacing(2),
        right: (theme) => theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
      }}
    >
      <Tooltip
        title={<Typography variant="body1">Export to Spotify</Typography>}
      >
        <Fab color="secondary" onClick={onClick}>
          {icon}
        </Fab>
      </Tooltip>
    </Box>
  );
};
