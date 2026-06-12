require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const { Sheet, Problem, Counter } = require("./models/sheetschemas");

//  Connect to MongoDB 
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project-webdev";
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
        return seedData();
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// Seed Function 
async function seedData() {
    try {
        // Read the JSON file
        const jsonPath = path.join(__dirname, "../dsa_problems_raw.json");
        const rawData = fs.readFileSync(jsonPath, "utf-8");
        const problems = JSON.parse(rawData);

        console.log(`📦 Found ${problems.length} problems to inject...`);

        // Clear existing data first
        await Sheet.deleteMany({});
        await Problem.deleteMany({});
        await Counter.deleteMany({});
        console.log("🗑️  Cleared existing sheet, problem, and counter data");

        // 1. Create a default sheet
        const defaultSheet = new Sheet({
            sheetName: "Strivers A2Z DSA Course/Sheet",
            totalQuestions: problems.length
        });
        await defaultSheet.save();
        console.log(`📝 Created default sheet: "${defaultSheet.sheetName}"`);

        // 2. Map problems to include the sheetId
        const problemsWithSheetId = problems.map((p) => ({
            ...p,
            sheetId: defaultSheet._id
        }));

        // 3. Create all problems (runs pre-save hook to generate problemId)
        const inserted = await Problem.create(problemsWithSheetId);
        console.log(`✅ Successfully injected ${inserted.length} problems into MongoDB!`);

    } catch (err) {
        console.error("❌ Seeding Error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 MongoDB Disconnected");
        process.exit(0);
    }
}
