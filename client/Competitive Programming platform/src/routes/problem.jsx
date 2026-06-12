import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Editor from '@monaco-editor/react';

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';

import Layout from "../ui/Layout";
import { styles, getDifficultyChipStyle } from "./problem.styles";
import { API_BASE_URL } from "../config";

const defaultTemplates = {
  javascript: `// Write your code here\n\nfunction solve() {\n    console.log("Hello, World!");\n}\nsolve();`,
  python: `# Write your code here\n\ndef solve():\n    print("Hello, World!")\n\nsolve()`,
  java: `// Write your code here\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  cpp: `// Write your code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  c: `// Write your code here\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  go: `// Write your code here\npackage main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
  rust: `// Write your code here\nfn main() {\n    println!("Hello, World!");\n}`,
  php: `<?php\n// Write your code here\necho "Hello, World!\\n";`
};

const languageIds = {
  javascript: 93, // Node.js 18.15.0
  python: 109,    // Python 3.13.2
  java: 91,       // Java (JDK 17.0.6)
  cpp: 105,       // C++ (GCC 14.1.0)
  c: 103,         // C (GCC 14.1.0)
  go: 107,        // Go (1.23.5)
  rust: 108,      // Rust (1.85.0)
  php: 98         // PHP (8.3.11)
};

const versions = {
  javascript: "18.15.0",
  python: "3.13.2",
  java: "17.0.6",
  cpp: "14.1.0",
  c: "14.1.0",
  go: "1.23.5",
  rust: "1.85.0",
  php: "8.3.11"
};

export default function ProblemEditor() {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultTemplates.javascript);
  
  // Execution response state
  const [res, setRes] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Problem data state
  const [data, setData] = useState(null);
  const { problemId } = useParams();

  // Override #root width dynamically to cover space fully in landscape
  useEffect(() => {
    const root = document.getElementById("root");
    let originalWidth = "";
    let originalMaxWidth = "";
    let originalBorderInline = "";

    if (root) {
      originalWidth = root.style.width;
      originalMaxWidth = root.style.maxWidth;
      originalBorderInline = root.style.borderInline;

      root.style.width = "100%";
      root.style.maxWidth = "100%";
      root.style.borderInline = "none";
    }

    return () => {
      if (root) {
        root.style.width = originalWidth;
        root.style.maxWidth = originalMaxWidth;
        root.style.borderInline = originalBorderInline;
      }
    };
  }, []);

  useEffect(() => {
    async function request() {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/editor/${problemId}`
        );
        console.log(res.data);
        setData(res.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    request();
  }, [problemId]);

  const handleChange = (event) => {
    const nextLang = event.target.value;
    setLanguage(nextLang);
    setCode(defaultTemplates[nextLang] || "");
    setRes(null); // Clear previous output when language changes
  };

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  async function runCode() {
    setIsRunning(true);
    setRes(null);
    try {
      const currentCode = editorRef.current ? editorRef.current.getValue() : code;
      const langId = languageIds[language];

      const response = await axios.post(
        "https://ce.judge0.com/submissions?wait=true",
        {
          source_code: currentCode,
          language_id: langId,
          stdin: ""
        }
      );

      console.log(response.data);
      setRes(response.data);
    } catch (err) {
      console.log(err);
      setRes({
        error: true,
        message: err.response?.data?.message || err.message || "Failed to execute code."
      });
    } finally {
      setIsRunning(false);
    }
  }

  if (!data) {
    return (
      <Box sx={styles.loaderContainer}>
        <CircularProgress sx={styles.loaderProgress} />
      </Box>
    );
  }

  return (
    <Layout>
    <Box sx={styles.container}>
      
      <Box sx={styles.innerContainer}>
        <Grid container sx={styles.gridContainer}>
          
          {/* Left Column: Problem Details */}
          <Grid item xs={12} md={6} sx={styles.gridItemLeft}>
            <Card sx={styles.leftCard}>
              <CardContent>
                {/* Title */}
                <Typography variant="h5" fontWeight="bold" sx={styles.title}>
                  <CodeIcon sx={{ color: "#00E5FF", fontSize: 28 }} />
                  {data.problemId ? parseInt(data.problemId.replace("P", "")) : ""}. {data.questionName}
                </Typography>

                {/* Tags */}
                <Box sx={styles.tagsContainer}>
                  <Chip
                    label={data.topic}
                    size="small"
                    sx={styles.topicChip}
                  />
                  <Chip
                    label={data.difficulty}
                    size="small"
                    sx={getDifficultyChipStyle(data.difficulty)}
                  />
                </Box>

                {/* Problem Statement */}
                <Typography variant="subtitle1" fontWeight="bold" sx={styles.sectionHeader}>
                  Problem Statement
                </Typography>
                <Typography variant="body1" sx={styles.statementBody}>
                  {data.question}
                </Typography>

                {/* Example */}
                <Typography variant="subtitle1" fontWeight="bold" sx={styles.sectionHeader}>
                  Example
                </Typography>
                <Box sx={styles.exampleBox}>
                  <Box component="pre" sx={styles.preText}>
                    {data.example}
                  </Box>
                </Box>

                {/* Explanation */}
                {data.explanation && (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" sx={styles.sectionHeader}>
                      Explanation
                    </Typography>
                    <Typography variant="body1" sx={styles.explanationBody}>
                      {data.explanation}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Code Editor & Console */}
          <Grid item xs={12} md={6} sx={styles.gridItemRight}>
            <Card sx={styles.rightCard}>
              {/* Header inside Editor Card */}
              <Box sx={styles.editorHeader}>
                <Typography variant="h6" fontWeight="bold" sx={styles.editorTitle}>
                  <CodeIcon sx={{ color: "#00E5FF" }} />
                  Interactive Editor
                </Typography>

                {/* Selection of language */}
                <Box sx={{ minWidth: 180 }}>
                  <FormControl fullWidth size="small" sx={styles.formControl}>
                    <InputLabel id="language-select-label">Language</InputLabel>
                    <Select
                      labelId="language-select-label"
                      id="language-select"
                      value={language}
                      label="Language"
                      onChange={handleChange}
                      MenuProps={styles.selectMenu}
                    >
                      <MenuItem value="javascript">JavaScript v{versions.javascript}</MenuItem>
                      <MenuItem value="python">Python v{versions.python}</MenuItem>
                      <MenuItem value="java">Java v{versions.java}</MenuItem>
                      <MenuItem value="cpp">C++ v{versions.cpp}</MenuItem>
                      <MenuItem value="c">C v{versions.c}</MenuItem>
                      <MenuItem value="go">Go v{versions.go}</MenuItem>
                      <MenuItem value="rust">Rust v{versions.rust}</MenuItem>
                      <MenuItem value="php">PHP v{versions.php}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Monaco Editor Container */}
              <Box sx={styles.editorContainer}>
                <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 16,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    tabSize: 2,
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />
              </Box>

              {/* Run Code Action */}
              <Box sx={styles.buttonsRow}>
                <Button
                  variant="contained"
                  onClick={runCode}
                  disabled={isRunning}
                  startIcon={isRunning ? <CircularProgress size={16} sx={{ color: "#111" }} /> : <PlayArrowIcon />}
                  sx={styles.runButton}
                >
                  {isRunning ? "Running..." : "Run Code"}
                </Button>
              </Box>

              {/* Console Log Panel */}
              <Box sx={styles.consoleBox}>
                {/* Console Title Bar */}
                <Box sx={styles.consoleTitleBar}>
                  <TerminalIcon fontSize="small" />
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ fontFamily: "inherit" }}>
                    Console Output
                  </Typography>
                </Box>

                {!res && !isRunning && (
                  <Typography variant="body2" sx={{ color: "#6B7280", fontStyle: "italic" }}>
                    Console is idle. Write some code and click "Run Code" to execute.
                  </Typography>
                )}

                {isRunning && (
                  <Typography variant="body2" sx={{ color: "#E5E7EB", display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={14} sx={{ color: "#00E5FF" }} />
                    Compiling and running code ...
                  </Typography>
                )}

                {res && (
                  res.error ? (
                    <Typography variant="body2" sx={{ color: "#EF4444" }}>
                      {res.message}
                    </Typography>
                  ) : (
                    <>
                      {/* Stats */}
                      <Box sx={styles.statsRow}>
                        <Box>
                          Status: <strong style={{ 
                            color: res.status?.id === 3 ? "#10B981" : "#F59E0B" 
                          }}>{res.status?.description || "Unknown"}</strong>
                        </Box>
                        {res.time && (
                          <Box sx={styles.statItem}>
                            Time: {res.time}s
                          </Box>
                        )}
                        {res.memory && (
                          <Box sx={styles.statItem}>
                            Memory: {(res.memory / 1024).toFixed(2)} MB
                          </Box>
                        )}
                      </Box>

                      {/* Outputs */}
                      {res.stdout && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" sx={{ color: "#10B981", display: "block", fontWeight: "bold", mb: 0.5 }}>
                            Stdout:
                          </Typography>
                          <Box component="pre" sx={styles.stdoutText}>
                            {res.stdout}
                          </Box>
                        </Box>
                      )}

                      {res.stderr && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" sx={{ color: "#EF4444", display: "block", fontWeight: "bold", mb: 0.5 }}>
                            Stderr:
                          </Typography>
                          <Box component="pre" sx={styles.stderrText}>
                            {res.stderr}
                          </Box>
                        </Box>
                      )}

                      {res.compile_output && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" sx={{ color: "#F59E0B", display: "block", fontWeight: "bold", mb: 0.5 }}>
                            Compilation Output:
                          </Typography>
                          <Box component="pre" sx={styles.compileOutputText}>
                            {res.compile_output}
                          </Box>
                        </Box>
                      )}

                      {!res.stdout && !res.stderr && !res.compile_output && (
                        <Typography variant="body2" sx={styles.successCompletedText}>
                          Execution completed successfully with exit code: {res.status?.id === 3 ? 0 : 1}
                        </Typography>
                      )}
                    </>
                  )
                )}
              </Box>

            </Card>
          </Grid>
          
        </Grid>
      </Box>
    </Box>
    </Layout>
  );
}