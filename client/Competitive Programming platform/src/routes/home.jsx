import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import { API_BASE_URL } from "../config";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CodeIcon from "@mui/icons-material/Code";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiHackerrank,
  SiHackerearth,
} from "react-icons/si";

import ContestButton from "../components/button";

const PLATFORM_COLORS = {
  Codeforces: { bg: "#1565c0", light: "rgba(21,101,192,0.18)" },
  LeetCode: { bg: "#f59e0b", light: "rgba(245,158,11,0.18)" },
  CodeChef: { bg: "#F6A000", light: "rgba(246,160,0,0.18)" },
  AtCoder: { bg: "#00A8E0", light: "rgba(0,168,224,0.18)" },
  HackerEarth: { bg: "#7b1fa2", light: "rgba(123,31,162,0.18)" },
  HackerRank: { bg: "#2e7d32", light: "rgba(46,125,50,0.18)" },
};

function getPlatformColor(platform) {
  for (const key of Object.keys(PLATFORM_COLORS)) {
    if (platform?.toLowerCase().includes(key.toLowerCase()))
      return PLATFORM_COLORS[key];
  }
  return { bg: "#00bcd4", light: "rgba(0,188,212,0.18)" };
}

function getPlatformIcon(platform, size = 16) {
  const p = platform?.toLowerCase() ?? "";
  if (p.includes("leetcode"))
    return (
      <span style={{ color: "#FFA116" }}>
        <SiLeetcode size={size} />
      </span>
    );
  if (p.includes("codeforces"))
    return (
      <span style={{ color: "#1F8ACB" }}>
        <SiCodeforces size={size} />
      </span>
    );
  if (p.includes("codechef"))
    return (
      <span style={{ color: "#F6A000" }}>
        <SiCodechef size={size} />
      </span>
    );
  if (p.includes("atcoder"))
    return (
      <span
        style={{
          color: "#00A8E0",
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1,
        }}
      >
        AC
      </span>
    );
  if (p.includes("hackerrank"))
    return (
      <span style={{ color: "#2EC866" }}>
        <SiHackerrank size={size} />
      </span>
    );
  if (p.includes("hackerearth"))
    return (
      <span style={{ color: "#2C3E8C" }}>
        <SiHackerearth size={size} />
      </span>
    );
  return (
    <span style={{ color: "#00E5FF" }}>
      <CodeIcon style={{ fontSize: size }} />
    </span>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Home() {
  const [res, setRes] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function contest() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/contests`);
        setRes(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    contest();
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Page background ── */}
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0d1117 0%, #141E30 55%, #0d1117 100%)",
          padding: "0 0 60px",
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        }}
      >
        {/* ── Hero Header ── */}
        <div
          style={{
            textAlign: "center",
            padding: "56px 24px 40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* subtle glow orb */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 520,
              height: 220,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(0,229,255,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(0,229,255,0.1)",
              border: "1px solid rgba(0,229,255,0.3)",
              borderRadius: 50,
              padding: "6px 20px",
              marginBottom: 20,
            }}
          >
            <RocketLaunchIcon style={{ color: "#00E5FF", fontSize: 16 }} />
            <span
              style={{
                color: "#00E5FF",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              LIVE CONTEST TRACKER
            </span>
          </div>

          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              background: "linear-gradient(90deg, #ffffff 30%, #00E5FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-1px",
              lineHeight: 1.15,
            }}
          >
            🏆 Upcoming Coding Contests
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 15,
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Stay ahead of every round. Track upcoming contests across all major
            competitive programming platforms.
          </p>
        </div>

        {/* ── Contest List ── */}
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px" }}>
          {res.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "rgba(255,255,255,0.3)",
                fontSize: 15,
              }}
            >
              <EmojiEventsIcon
                style={{
                  fontSize: 48,
                  opacity: 0.2,
                  display: "block",
                  margin: "0 auto 12px",
                }}
              />
              Loading contests…
            </div>
          )}

          {res.map((contest, index) => {
            const platformColor = getPlatformColor(contest.platform);
            const isOpen = expanded === index;

            return (
              <Accordion
                key={index}
                expanded={isOpen}
                onChange={() => setExpanded(isOpen ? false : index)}
                disableGutters
                sx={{
                  background: isOpen
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.03)",
                  border: isOpen
                    ? `1px solid ${platformColor.bg}55`
                    : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "16px !important",
                  mb: 2,
                  overflow: "hidden",
                  boxShadow: isOpen ? `0 0 28px ${platformColor.bg}33` : "none",
                  transition: "all 0.3s ease",
                  "&:before": { display: "none" },
                  "&:hover": {
                    border: `1px solid ${platformColor.bg}77`,
                    background: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: "#00E5FF",
                        transition: "transform 0.3s",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  }
                  sx={{
                    px: 3,
                    py: 1.5,
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    },
                  }}
                >
                  {/* Platform badge */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {getPlatformIcon(contest.platform, 15)}
                    {contest.platform}
                  </span>

                  <span
                    style={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 15,
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {contest.name}
                  </span>

                  {/* Duration pill – desktop */}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <AccessTimeIcon style={{ fontSize: 14 }} />
                    {contest.duration} min
                  </span>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Divider
                    sx={{ borderColor: "rgba(255,255,255,0.07)", mb: 2.5 }}
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 16,
                      marginBottom: 24,
                    }}
                  >
                    {/* Duration card */}
                    <div
                      style={{
                        background: "rgba(0,229,255,0.06)",
                        border: "1px solid rgba(0,229,255,0.15)",
                        borderRadius: 12,
                        padding: "14px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <AccessTimeIcon
                        style={{ color: "#00E5FF", fontSize: 22 }}
                      />
                      <div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.45)",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Duration
                        </div>
                        <div
                          style={{
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 16,
                          }}
                        >
                          {contest.duration} min
                        </div>
                      </div>
                    </div>

                    {/* Start time card */}
                    <div
                      style={{
                        background: "rgba(0,229,255,0.06)",
                        border: "1px solid rgba(0,229,255,0.15)",
                        borderRadius: 12,
                        padding: "14px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <CalendarMonthIcon
                        style={{ color: "#00E5FF", fontSize: 22 }}
                      />
                      <div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.45)",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Starts
                        </div>
                        <div
                          style={{
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                          }}
                        >
                          {formatDate(contest.startTime)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <ContestButton link={contest.url} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </div>
    </>
  );
}

// import { useEffect } from "react"
// import Navbar from "../components/navbar"
// import axios from "axios"
// import { useState } from "react"
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import { motion } from "framer-motion";
// import Button  from "../components/button";

// export default function Home(){
//   let [res,setRes]=useState([]);

//   useEffect(()=>{
//     async function contest(){

//       try{
//         let res = await axios.get(
//           "http://localhost:3000/api/contests"
//         )
//         setRes(res.data);
//         console.log(res.data);
//       }
//       catch(err){
//         console.log(err);
//       }
//     }

//     contest();
//   },[]);

//   return(
//     <>
//     <Navbar/>
//     {
//       res.map((constest,index)=>(
//      <Card
//       key={index}
//       component={motion.div}
//       initial={{ y: 50, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{
//         duration: 0.5,
//         ease: "easeOut",
//       }}
//       sx={{
//         mb: 2,
//         cursor: "pointer",
//       }}
//     >
//       <CardContent>
//         <Typography color="h5">
//           {constest.platform}
//         </Typography>

//         <Typography variant="h6">
//           {constest.name}
//         </Typography>

//         <Typography variant="h6">
//           <span>Duration = </span>{constest.duration}<span>min</span>
//         </Typography>

//         <Typography>
//            {new Date(constest.startTime).toLocaleString("en-IN")}
//         </Typography>

//         <Button link={constest.url}/>
//       </CardContent>
//     </Card>
// ))}
//     </>
//   )
// }
