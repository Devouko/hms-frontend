// Replace all text-primary with text-[#38bdf8] in MainApp.tsx
const fs = require('fs');
const path = './src/components/MainApp.tsx';

fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  
  const result = data.replace(/text-primary/g, 'text-[#38bdf8]');
  
  fs.writeFile(path, result, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File updated successfully');
  });
});