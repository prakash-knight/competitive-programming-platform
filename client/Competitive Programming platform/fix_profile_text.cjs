const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'routes', 'profile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace color="text.primary"
content = content.replace(/color="text\.primary"/g, "sx={{ color: '#c9d1d9' }}");

// 2. Replace color="text.secondary"
content = content.replace(/color="text\.secondary"/g, "sx={{ color: '#8b949e' }}");
content = content.replace(/color:\s*'text\.secondary'/g, "color: '#8b949e'");

// 3. Fix double sx={{...}} sx={{...}} issues (specifically the ones my previous script created)
content = content.replace(/sx=\{\{ color: '#8b949e' \}\}\s*sx=\{\{ (.*?) \}\}/g, "sx={{ color: '#8b949e', $1 }}");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed text colors!');
