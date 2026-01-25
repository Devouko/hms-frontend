const fs = require('fs');

// Fix all components to use sky blue color
const files = [
  './src/components/MainApp.tsx',
  './src/components/AdminDashboard.tsx',
  './src/components/ui/button.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace all primary color references
    content = content.replace(/bg-primary(?!\-)/g, 'bg-[#38bdf8]');
    content = content.replace(/text-primary(?!\-)/g, 'text-[#38bdf8]');
    content = content.replace(/border-primary(?!\-)/g, 'border-[#38bdf8]');
    content = content.replace(/hover:bg-primary\/90/g, 'hover:bg-[#0ea5e9]');
    content = content.replace(/hover:bg-primary\/80/g, 'hover:bg-[#0ea5e9]');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('All files updated with sky blue color!');