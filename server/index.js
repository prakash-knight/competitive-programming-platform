require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const path     = require("path");
const fs       = require("fs");

const User               = require("./models/loginschema");
const { Sheet, Problem, Counter } = require("./models/sheetschemas");
const UserInfo           = require("./models/userschema");


const app  = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project-webdev";
mongoose.connect(MONGODB_URI)
.then(() => { console.log("MongoDB Connected"); })
.catch((err) => { console.log(err); });

// Middleware
app.use(cors());
app.use(express.json());

//  Home 
app.get("/", (req, res) => { res.send("Backend Running"); });

// Auth Routes 

// Signup
app.post("/auth/signup", async (req, res) => {
    try {
        const { userid, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ userid }, { email }] });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const newUser = new User({ userid, email, password });
        await newUser.save();
        console.log(newUser);

        res.status(201).json({ success: true, message: "Signup Successful", user: newUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Login
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email ? email.trim().toLowerCase() : "";
        const user = await User.findOne({ email: cleanEmail, password });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        res.json({ success: true, message: "Login Successful", user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//  Sheet Routes 

// GET all sheets (name + totalQuestions)
app.get("/sheets", async (req, res) => {
    try {
        const allSheets = await Sheet.find();
        res.status(200).json({ success: true, data: allSheets });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET all problems of a specific sheet
app.get("/sheets/:sheetId/problems", async (req, res) => {
    try {
        const problems = await Problem.find({ sheetId: req.params.sheetId });
        res.status(200).json({ success: true, data: problems });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//  Profile Route 
// GET user profile by userid
app.get("/user/:userid", async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await User.findOne({ userid });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const userprogress = await UserInfo.findOne({ userid });
        const progressWithSheetNames = await Promise.all(
            userprogress.progress.map(async (item) => {
                const sheet = await Sheet.findById(item.sheetId);

                return {
                    ...item.toObject(),
                    sheetName: sheet ? sheet.sheetName : null
                };
            })
        );
        const { password, ...safeUser } = user.toObject();
        res.json({
            success: true,
            data: safeUser,
            progress: progressWithSheetNames
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

app.get("/api/contests", async (req, res) => {
  const now = Date.now();

  // ── Fetch each platform independently ──────────────────────────
  const [cfResult, lcResult, atResult, ccResult] = await Promise.allSettled([

    // 1. Codeforces
    fetch("https://codeforces.com/api/contest.list")
      .then(r => r.json())
      .then(data =>
        data.result
          .filter(c => c.phase === "BEFORE")
          .map(c => ({
            platform: "Codeforces",
            name:      c.name,
            startTime: c.startTimeSeconds * 1000,
            duration:  Math.round(c.durationSeconds / 60),
            url:       `https://codeforces.com/contests/${c.id}`,
          }))
      ),

    // 2. LeetCode (GraphQL)
    fetch("https://leetcode.com/graphql", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        query: `query { allContests { title startTime duration } }`
      }),
    })
      .then(r => r.json())
      .then(data =>
        (data.data?.allContests ?? [])
          .filter(c => c.startTime * 1000 > now)
          .map(c => ({
            platform: "LeetCode",
            name:      c.title,
            startTime: c.startTime * 1000,
            duration:  Math.round(c.duration / 60),
            url:       "https://leetcode.com/contest/",
          }))
      ),

    // 3. AtCoder (via AtCoder Problems – kenkoooo.com)
    fetch("https://kenkoooo.com/atcoder/resources/contests.json", {
      headers: { "Accept-Encoding": "gzip" }
    })
      .then(r => r.json())
      .then(data =>
        data
          .filter(c => c.start_epoch_second * 1000 > now)
          .map(c => ({
            platform: "AtCoder",
            name:      c.title,
            startTime: c.start_epoch_second * 1000,
            duration:  Math.round(c.duration_second / 60),
            url:       `https://atcoder.jp/contests/${c.id}`,
          }))
      ),

    // 4. CodeChef (unofficial internal endpoint)
    fetch("https://www.codechef.com/api/list/contests/future?sort_by=start&sorting_order=asc&offset=0&mode=all", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept":     "application/json",
      }
    })
      .then(r => r.json())
      .then(data => {
        const list = data.future_contests ?? data.contests ?? [];
        return list.map(c => ({
          platform: "CodeChef",
          name:      c.contest_name,
          startTime: new Date(c.contest_start_date_iso ?? c.contest_start_date).getTime(),
          duration:  Math.round(Number(c.contest_duration) || 0),
          url:       `https://www.codechef.com/${c.contest_code}`,
        }));
      }),

  ]);

  // ── Merge fulfilled results, log failures ──────────────────────
  const platformNames = ["Codeforces", "LeetCode", "AtCoder", "CodeChef"];
  const allContests   = [];

  [cfResult, lcResult, atResult, ccResult].forEach((result, i) => {
    if (result.status === "fulfilled") {
      allContests.push(...result.value);
    } else {
      console.error(`[contests] ${platformNames[i]} fetch failed:`, result.reason?.message);
    }
  });

  // Sort by upcoming startTime
  allContests.sort((a, b) => a.startTime - b.startTime);

  res.json(allContests);
});

//problem fetch for editor page
app.get("/editor/:problemId", async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await Problem.findOne({ problemId });

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    res.json({ success: true, data: problem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



// Start Server 
app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});



























// ── Check: which problems are missing a problemId ─────────────────
// GET /admin/check-problem-ids
// app.get("/admin/check-problem-ids", async (req, res) => {
//   try {
//     const total    = await Problem.countDocuments();
//     const missing  = await Problem.countDocuments({ problemId: { $exists: false } });
//     const withId   = await Problem.countDocuments({ problemId: { $exists: true } });

//     const missingList = await Problem.find(
//       { problemId: { $exists: false } },
//       { questionName: 1, _id: 1 }
//     ).lean();

//     res.json({
//       success: true,
//       total,
//       withId,
//       missing,
//       missingProblems: missingList,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

// // ── Backfill: assign problemIds to all existing problems that lack one ──
// // POST /admin/backfill-problem-ids
// app.post("/admin/backfill-problem-ids", async (req, res) => {
//   try {
//     const problems = await Problem.find({ problemId: { $exists: false } }).lean();

//     if (problems.length === 0) {
//       return res.json({ success: true, message: "All problems already have a problemId", updated: 0 });
//     }

//     let updated = 0;
//     for (const p of problems) {
//       // Atomically get next counter value
//       const counter = await Counter.findByIdAndUpdate(
//         "problemId",
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true }
//       );
//       const newId = "P" + String(counter.seq).padStart(4, "0");

//       await Problem.updateOne({ _id: p._id }, { $set: { problemId: newId } });
//       updated++;
//     }

//     res.json({
//       success: true,
//       message: `Assigned problemIds to ${updated} problem(s)`,
//       updated,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// });


// User-Progress Seeder 
// POST /seed-users
// For every user in loginschema × every sheet in sheetschemas,
// create (or update) a userinfo progress document.
// Safe to call multiple times — uses upsert so existing docs are not duplicated.
// app.post("/seed-users", async (req, res) => {
//     try {
//         const users = await User.find();
//         const sheets = await Sheet.find();

//         if (users.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No users found in DB"
//             });
//         }

//         if (sheets.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No sheets found in DB"
//             });
//         }

//         let created = 0;
//         let updated = 0;

//         for (const user of users) {
//             const progressEntries = sheets.map((sheet) => ({
//                 sheetId: sheet._id,
//                 questionsDone: 0,
//                 totalQuestions: sheet.totalQuestions,
//             }));

//             const existingUserInfo = await UserInfo.findOne({
//                 userid: user.userid,
//             });

//             if (!existingUserInfo) {
//                 await UserInfo.create({
//                     userid: user.userid,
//                     progress: progressEntries,
//                 });

//                 created++;
//             } else {
//                 existingUserInfo.progress = progressEntries;
//                 await existingUserInfo.save();

//                 updated++;
//             }
//         }

//         console.log(`seed-users: created=${created}, updated=${updated}`);

//         res.status(200).json({
//             success: true,
//             message: `Processed ${users.length} users across ${sheets.length} sheets`,
//             created,
//             updated,
//         });

//     } catch (err) {
//         console.error(err);

//         res.status(500).json({
//             success: false,
//             message: "User seeding failed",
//             error: err.message,
//         });
//     }
// });
