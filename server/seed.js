const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const sheets = require("./models/sheetschemas");

//  Connect to MongoDB 
mongoose.connect("mongodb://127.0.0.1:27017/project-webdev")
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

        // Optional: Clear existing data first (comment out if you don't want this)
        await sheets.deleteMany({});
        console.log("🗑️  Cleared existing sheet data");

        // Bulk insert all problems at once
        const inserted = await sheets.insertMany(problems);

        console.log(`✅ Successfully injected ${inserted.length} problems into MongoDB!`);

    } catch (err) {
        console.error("❌ Seeding Error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 MongoDB Disconnected");
        process.exit(0);
    }
}
