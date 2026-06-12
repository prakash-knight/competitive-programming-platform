export const styles = {
  container: {
    minHeight: "calc(100vh - 76px)",
    height: "calc(100vh - 76px)",
    bgcolor: "#0B0F19",
    color: "#F3F4F6",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  innerContainer: {
    px: { xs: 2, md: 3 },
    py: 2,
    width: "100%",
    maxWidth: "100%",
    flexGrow: 1,
    boxSizing: "border-box",
    overflow: "hidden"
  },
  gridContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    gap: 3
  },
  gridItemLeft: {
    height: "100%",
    width: { xs: "100%", md: "50%" },
    display: "flex",
    flexDirection: "column"
  },
  gridItemRight: {
    height: "100%",
    width: { xs: "100%", md: "50%" },
    display: "flex",
    flexDirection: "column"
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    bgcolor: "#0B0F19",
  },
  loaderProgress: {
    color: "#00E5FF",
  },
  leftCard: {
    height: "100%",
    overflowY: "auto",
    bgcolor: "#111827",
    color: "#F3F4F6",
    borderRadius: 4,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.6)",
    p: 3,
    boxSizing: "border-box",
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#111827',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#1F2937',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#374151',
    }
  },
  rightCard: {
    height: "100%",
    bgcolor: "#111827",
    color: "#F3F4F6",
    borderRadius: 4,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.6)",
    p: 3,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    boxSizing: "border-box"
  },
  title: {
    mb: 2,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    fontFamily: 'Poppins, sans-serif'
  },
  tagsContainer: {
    display: "flex",
    gap: 1.5,
    mb: 3,
    flexWrap: "wrap"
  },
  topicChip: {
    bgcolor: "rgba(0, 229, 255, 0.08)",
    color: "#00E5FF",
    border: "1px solid rgba(0, 229, 255, 0.3)",
    fontWeight: "bold",
  },
  sectionHeader: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    pb: 1,
    mb: 2,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: "0.05rem",
    fontSize: "0.85rem"
  },
  statementBody: {
    mb: 4,
    whiteSpace: "pre-wrap",
    lineHeight: 1.8,
    color: "#E5E7EB",
    fontSize: "0.95rem"
  },
  exampleBox: {
    bgcolor: "#1F2937",
    p: 2,
    borderRadius: 3,
    mb: 4,
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  preText: {
    margin: 0,
    whiteSpace: "pre-wrap",
    fontFamily: "Consolas, Monaco, Courier New, monospace",
    fontSize: "0.9rem",
    color: "#E5E7EB"
  },
  explanationBody: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.8,
    color: "#D1D5DB",
    fontSize: "0.95rem"
  },
  editorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2
  },
  editorTitle: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    fontFamily: 'Poppins, sans-serif'
  },
  formControl: {
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.6)' },
    '& .MuiOutlinedInput-root': {
      color: '#FFF',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
      '&:hover fieldset': { borderColor: '#00E5FF' },
      '&.Mui-focused fieldset': { borderColor: '#00E5FF' },
    },
    '& .MuiSelect-icon': { color: '#00E5FF' }
  },
  selectMenu: {
    PaperProps: {
      sx: {
        bgcolor: "#1F2937",
        color: "#FFF",
        '& .MuiMenuItem-root': {
          '&:hover': { bgcolor: "rgba(0, 229, 255, 0.1)" },
          '&.Mui-selected': { bgcolor: "rgba(0, 229, 255, 0.2)", color: "#00E5FF" }
        }
      }
    }
  },
  editorContainer: {
    flexGrow: 1,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    minHeight: "200px"
  },
  buttonsRow: {
    display: "flex",
    gap: 2
  },
  runButton: {
    background: "linear-gradient(135deg, #00E5FF 0%, #00B0FF 100%)",
    color: "#0B0F19",
    fontWeight: "bold",
    textTransform: "none",
    px: 4,
    py: 1,
    borderRadius: 2,
    boxShadow: "0 4px 15px rgba(0, 229, 255, 0.3)",
    transition: "all 0.2s ease-in-out",
    '&:hover': {
      background: "linear-gradient(135deg, #00F5FF 0%, #00C0FF 100%)",
      boxShadow: "0 6px 20px rgba(0, 229, 255, 0.5)",
      transform: "translateY(-1px)"
    },
    '&:disabled': {
      background: "rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.3)",
    }
  },
  consoleBox: {
    height: "180px",
    overflowY: "auto",
    bgcolor: "#0B0F19",
    color: "#D1D5DB",
    borderRadius: 3,
    p: 2,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    fontFamily: "Consolas, Monaco, Courier New, monospace",
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#0B0F19',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#1F2937',
      borderRadius: '3px',
    },
  },
  consoleTitleBar: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    color: "#00E5FF",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    pb: 1,
    mb: 1.5
  },
  statsRow: {
    mb: 1.5,
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    fontSize: "0.85rem"
  },
  statItem: {
    color: "#9CA3AF"
  },
  stdoutText: {
    margin: 0,
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
    fontSize: "0.85rem",
    color: "#10B981"
  },
  stderrText: {
    margin: 0,
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
    fontSize: "0.85rem",
    color: "#EF4444"
  },
  compileOutputText: {
    margin: 0,
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
    fontSize: "0.85rem",
    color: "#F59E0B"
  },
  successCompletedText: {
    color: "#9CA3AF",
    fontSize: "0.85rem"
  }
};

export const getDifficultyChipStyle = (difficulty) => ({
  background:
    difficulty === "Easy"
      ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
      : difficulty === "Medium"
      ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
      : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
  color: "#FFF",
  fontWeight: "bold",
});
