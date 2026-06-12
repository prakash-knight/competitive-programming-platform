import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function LeetCodeProgress({ solved, total }) {
  const percentage = (solved / total) * 100;

  return (
    <Box
      sx={{
        position: "relative",
        width: 140,
        height: 140,
      }}
    >
      {/* Background */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={140}
        thickness={4}
        sx={{
          color: "#333",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Progress */}
      <CircularProgress
        variant="determinate"
        value={percentage}
        size={140}
        thickness={4}
        sx={{
          color: "#00b8a3",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Center Text */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">
          {solved}
        </Typography>

        <Typography variant="body2">
          / {total}
        </Typography>
      </Box>
    </Box>
  );
}