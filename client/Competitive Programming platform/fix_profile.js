const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'routes', 'profile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Main Box background
content = content.replace(
  /background: isDarkMode\s*\?\s*'radial-gradient\(circle at 50% 0%, #1e293b 0%, #0f172a 100%\)'\s*:\s*'radial-gradient\(circle at 50% 0%, #f1f5f9 0%, #f8fafc 100%\)',/g,
  "background: 'transparent',"
);

// Paper background (Header)
content = content.replace(
  /bgcolor: isDarkMode \? '#1e293b' : '#fff',\s*border: '1px solid',\s*borderColor: isDarkMode \? 'rgba\(255,255,255,0\.05\)' : 'rgba\(0,0,0,0\.05\)'/g,
  "bgcolor: '#161b22', border: '1px solid #30363d', color: '#c9d1d9'"
);

// Stat cards Paper background
content = content.replace(
  /bgcolor: isDarkMode \? '#1e293b' : '#fff',\s*border: '1px solid',\s*borderColor: isDarkMode \? 'rgba\(255,255,255,0\.05\)' : 'rgba\(0,0,0,0\.05\)',\s*transition: 'transform 0\.2s',\s*'&:hover': \{ transform: 'translateY\(-4px\)' \}/g,
  "bgcolor: '#161b22', border: '1px solid #30363d', color: '#c9d1d9', transition: 'transform 0.2s, border-color 0.2s', '&:hover': { transform: 'translateY(-4px)', borderColor: '#8b949e' }"
);

// Sheets cards Paper background
content = content.replace(
  /bgcolor: isDarkMode \? 'rgba\(255,255,255,0\.02\)' : 'rgba\(0,0,0,0\.02\)',\s*border: '1px solid',\s*borderColor: isDarkMode \? 'rgba\(255,255,255,0\.05\)' : 'rgba\(0,0,0,0\.05\)',\s*transition: 'all 0\.2s',\s*'&:hover': \{\s*borderColor: '#00E5FF',\s*transform: 'translateY\(-4px\)',\s*boxShadow: '0 10px 25px -5px rgba\(0, 229, 255, 0\.1\)'\s*\}/g,
  "bgcolor: '#161b22', border: '1px solid #30363d', transition: 'all 0.2s', '&:hover': { borderColor: '#8b949e', transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }"
);

// Avatar styling
content = content.replace(
  /borderColor: isDarkMode \? '#0f172a' : '#fff',\s*backgroundColor: '#00E5FF',/g,
  "borderColor: '#0d1117',\n                backgroundColor: '#22d3ee',"
);

// Heatmap empty cell color
content = content.replace(
  /bgcolor: count === 0\s*\?\s*\(isDarkMode \? '#334155' : '#e2e8f0'\)\s*:\s*`rgba\(0, 229, 255, \$\{opacity\}\)`/g,
  "bgcolor: count === 0 ? '#21262d' : `rgba(34, 211, 238, ${opacity})`"
);

// Progress bar colors
content = content.replace(
  /bgcolor: isDarkMode \? '#334155' : '#e2e8f0'/g,
  "bgcolor: '#21262d'"
);
content = content.replace(
  /bgcolor: '#00E5FF'/g,
  "bgcolor: '#22d3ee'"
);

// Text colors
content = content.replace(/color: isDarkMode \? '#f8fafc' : '#0f172a'/g, "color: '#c9d1d9'");
content = content.replace(/color: isDarkMode \? '#94a3b8' : '#64748b'/g, "color: '#8b949e'");
content = content.replace(/color="text\.secondary"/g, "sx={{ color: '#8b949e' }}");

// Elevation replacements
content = content.replace(/elevation=\{4\}/g, "elevation={0}");
content = content.replace(/elevation=\{2\}/g, "elevation={0}");

// Fix the banner gradient to something less blue
content = content.replace(
  /background: 'linear-gradient\(135deg, #334155 0%, #0f172a 100%\)',/g,
  "background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',"
);

// Change all '#00E5FF' icons to '#22d3ee'
content = content.replace(/#00E5FF/g, "#22d3ee");

// Change specific color instances
content = content.replace(/color: '#0f172a'/g, "color: '#111'");

// Font family to match global
content = content.replace(/fontWeight="800"/g, "fontWeight=\"800\" fontFamily=\"var(--font-family)\"");
content = content.replace(/fontWeight=\{700\}/g, "fontWeight={700} fontFamily=\"var(--font-family)\"");
content = content.replace(/fontWeight="bold"/g, "fontWeight=\"bold\" fontFamily=\"var(--font-family)\"");


fs.writeFileSync(filePath, content, 'utf8');
console.log('Done replacing styles!');
