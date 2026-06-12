import Button from "@mui/material/Button";
import CodeIcon from "@mui/icons-material/Code";

export default function ContestButton({ link }) {
  return (
    <Button
      variant="contained"
      startIcon={<CodeIcon />}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
  background: "#6b7280",
  color: "#fff",
  textTransform: "none",
  fontWeight: 600,
  px: 3,
  py: 1,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",

  "&:hover": {
    background: "#4b5563",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  },
}}
    >
      Join Contest
    </Button>
  );
}
