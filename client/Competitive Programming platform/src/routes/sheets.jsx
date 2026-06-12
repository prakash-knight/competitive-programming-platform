import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import CircularProgress from "@mui/material/CircularProgress";
import Layout from "../ui/Layout";

const BASE = "http://localhost:3000";

export default function SheetsPage() {
  const navigate = useNavigate();
  const [sheets, setSheets]           = useState([]);          // list of sheets
  const [activeSheet, setActiveSheet] = useState(null);        // selected sheet object
  const [groupedProblems, setGroupedProblems] = useState({});  // problems grouped by topic
  const [loading, setLoading]         = useState(false);

  // ── 1. Fetch all sheets on mount ──────────────────────────────────────────
  useEffect(() => {
    async function fetchSheets() {
      try {
        const res = await axios.get(`${BASE}/sheets`);
        const data = res.data.data;
        setSheets(data);
        if (data.length > 0) setActiveSheet(data[0]); // auto-select first sheet
      } catch (err) {
        console.log(err);
      }
    }
    fetchSheets();
  }, []);

  // ── 2. Fetch problems whenever active sheet changes ───────────────────────
  useEffect(() => {
    if (!activeSheet) return;

    async function fetchProblems() {
      try {
        setLoading(true);
        setGroupedProblems({});
        const res = await axios.get(`${BASE}/sheets/${activeSheet._id}/problems`);
        const problems = res.data.data;

        // Group problems by topic
        const groups = {};
        problems.forEach((p) => {
          if (!groups[p.topic]) groups[p.topic] = [];
          groups[p.topic].push(p);
        });

        setGroupedProblems(groups);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, [activeSheet]);

 
  return (
    <Layout>
    <Box sx={{ maxWidth: 950, mx: "auto", p: 3 }}>

      {/* ── Page Title ── */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        DSA Problem Sheets
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select a sheet below to view its problems
      </Typography>

      {/* ── Sheet Tabs ── */}
      {sheets.length > 0 && (
        <Tabs
          value={activeSheet?._id || false}
          onChange={(_, id) => setActiveSheet(sheets.find((s) => s._id === id))}
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {sheets.map((sheet) => (
            <Tab
              key={sheet._id}
              label={sheet.sheetName}
              value={sheet._id}
              sx={{ fontWeight: 600, textTransform: "none", fontSize: "0.95rem" }}
            />
          ))}
        </Tabs>
      )}

      {/* ── Loading ── */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ── Problems grouped by Topic ── */}
      {!loading && Object.entries(groupedProblems).map(([topic, problems]) => (

        <Accordion key={topic} sx={{ mb: 1.5, borderRadius: 1 }}>

          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h6" fontWeight="700">
                {topic}
              </Typography>
              <Chip
                label={`${problems.length} problems`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>

            {problems.map((problem, index) => (

              <Accordion
                key={problem._id || index}
                disableGutters
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "8px !important",
                  mb: 1,
                  "&:before": { display: "none" },
                }}
              >

                {/* Inner Header = Question Name + Difficulty Chip */}
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Typography fontWeight="600">
                      {index + 1}. {problem.questionName}
                    </Typography>
                    <Chip
                      label={problem.difficulty}
                      size="small"
                      color={
                        problem.difficulty === "Easy"
                          ? "success"
                          : problem.difficulty === "Medium"
                          ? "warning"
                          : "error"
                      }
                    />
                  </Box>
                </AccordionSummary>

                {/* Inner Body = Full Question Details */}
                <AccordionDetails sx={{ px: 3, pb: 3 }}>

                  <Divider sx={{ mb: 2 }} />

                  {/* Platform + Topic row */}
                  <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                    <Chip label={`Topic: ${problem.topic}`} size="small" variant="outlined" />
                    <Chip label={`Platform: ${problem.platform}`} size="small" variant="outlined" color="secondary" />
                  </Box>

                  {/* Question */}
                  {problem.question && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 0.5 }}>
                        📋 Problem Statement
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                        {problem.question}
                      </Typography>
                    </Box>
                  )}

                  {/* Example
                  {problem.example && (
                    <Box sx={{ mb: 2, bgcolor: "action.hover", borderRadius: 1, p: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 0.5 }}>
                        💡 Example
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: "pre-line", fontFamily: "monospace" }}>
                        {problem.example}
                      </Typography>
                    </Box>
                  )}

                  {/* Explanation */}{/*
                  {problem.explanation && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 0.5 }}>
                        🧠 Explanation
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                        {problem.explanation}
                      </Typography>
                    </Box>
                  )} */}

                  {/* Solve Button */}
                  <Button
                    variant="contained"
                    size="small"
                    href={problem.problemLink}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ mt: 1 }}
                  >
                    Solve on {problem.platform} →
                  </Button>
                  <br></br>

                  {/* solve in eeditor */}
                 <Button
                    variant="contained"
                    size="small"
                    target="_blank"
                    rel="noreferrer"
                    sx={{ mt: 1 }}
                    onClick={() => navigate(`/editor/${problem.problemId}`)}
                  >
                    Solve in Editor →
                  </Button>

                </AccordionDetails>

              </Accordion>

            ))}

          </AccordionDetails>

        </Accordion>

      ))}

    </Box>
    </Layout>
  );
}