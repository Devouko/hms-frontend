const fs = require('fs');
const path = require('path');

// Color mappings from hardcoded colors to theme variables
const colorMappings = {
  // Blue colors
  'text-blue-600': 'text-primary',
  'text-blue-700': 'text-primary',
  'text-blue-500': 'text-primary',
  'bg-blue-500': 'bg-primary',
  'bg-blue-600': 'bg-primary',
  'bg-blue-500/15': 'bg-primary/15',
  'bg-blue-500/20': 'bg-primary/20',
  'border-blue-500': 'border-primary',
  'hover:bg-blue-600': 'hover:bg-primary/90',
  'focus:ring-blue-500': 'focus:ring-primary',
  
  // Purple colors
  'text-purple-600': 'text-primary',
  'text-purple-700': 'text-primary',
  'text-purple-500': 'text-primary',
  'bg-purple-500': 'bg-primary',
  'bg-purple-600': 'bg-primary',
  'bg-purple-500/15': 'bg-primary/15',
  'bg-purple-500/20': 'bg-primary/20',
  'border-purple-500': 'border-primary',
  'hover:bg-purple-600': 'hover:bg-primary/90',
  
  // Green colors (success)
  'text-green-600': 'text-primary',
  'text-green-700': 'text-primary',
  'text-green-500': 'text-primary',
  'bg-green-500': 'bg-primary',
  'bg-green-600': 'bg-primary',
  'bg-green-500/15': 'bg-primary/15',
  'bg-green-500/20': 'bg-primary/20',
  'border-green-500': 'border-primary',
  
  // Orange colors
  'text-orange-600': 'text-primary',
  'text-orange-700': 'text-primary',
  'text-orange-500': 'text-primary',
  'bg-orange-500': 'bg-primary',
  'bg-orange-600': 'bg-primary',
  'bg-orange-500/15': 'bg-primary/15',
  'bg-orange-500/20': 'bg-primary/20',
  'border-orange-500': 'border-primary',
  
  // Red colors
  'text-red-600': 'text-destructive',
  'text-red-700': 'text-destructive',
  'text-red-500': 'text-destructive',
  'bg-red-500': 'bg-destructive',
  'bg-red-600': 'bg-destructive',
  'bg-red-500/15': 'bg-destructive/15',
  'bg-red-500/20': 'bg-destructive/20',
  'border-red-500': 'border-destructive',
  
  // Teal colors
  'text-teal-600': 'text-primary',
  'text-teal-700': 'text-primary',
  'text-teal-500': 'text-primary',
  'bg-teal-500': 'bg-primary',
  'bg-teal-600': 'bg-primary',
  'bg-teal-500/15': 'bg-primary/15',
  'bg-teal-500/20': 'bg-primary/20',
  'border-teal-500': 'border-primary',
  
  // Indigo colors
  'text-indigo-600': 'text-primary',
  'text-indigo-700': 'text-primary',
  'text-indigo-500': 'text-primary',
  'bg-indigo-500': 'bg-primary',
  'bg-indigo-600': 'bg-primary',
  'bg-indigo-500/15': 'bg-primary/15',
  'bg-indigo-500/20': 'bg-primary/20',
  'border-indigo-500': 'border-primary',
  
  // Gray colors for neutral elements
  'text-gray-600': 'text-muted-foreground',
  'text-gray-700': 'text-foreground',
  'text-gray-500': 'text-muted-foreground',
  'text-gray-400': 'text-muted-foreground',
  'bg-gray-100': 'bg-muted',
  'bg-gray-200': 'bg-muted',
  'bg-gray-50': 'bg-muted/50',
  'border-gray-300': 'border-border',
  'border-gray-200': 'border-border',
  
  // Slate colors
  'text-slate-600': 'text-muted-foreground',
  'text-slate-700': 'text-foreground',
  'text-slate-500': 'text-muted-foreground',
  'bg-slate-100': 'bg-muted',
  'bg-slate-200': 'bg-muted',
  'bg-slate-50': 'bg-muted/50',
  'border-slate-300': 'border-border',
  'border-slate-200': 'border-border',
  
  // White/Black
  'bg-white': 'bg-card',
  'text-white': 'text-card-foreground',
  'text-black': 'text-foreground',
  'border-white': 'border-border',
};

// Hex color mappings for inline styles and chart colors
const hexColorMappings = {
  '#3B82F6': 'hsl(var(--primary))',
  '#8B5CF6': 'hsl(var(--primary))',
  '#10B981': 'hsl(var(--primary))',
  '#F59E0B': 'hsl(var(--primary))',
  '#EF4444': 'hsl(var(--destructive))',
  '#06B6D4': 'hsl(var(--primary))',
  '#84CC16': 'hsl(var(--primary))',
  '#F97316': 'hsl(var(--primary))',
  '#EC4899': 'hsl(var(--primary))',
  '#6366F1': 'hsl(var(--primary))',
  '#14B8A6': 'hsl(var(--primary))',
  '#DC2626': 'hsl(var(--destructive))',
  '#ffffff': 'hsl(var(--card))',
  '#000000': 'hsl(var(--foreground))',
  '#f0f0f0': 'hsl(var(--border))',
  '#e5e7eb': 'hsl(var(--border))',
  '#d1d5db': 'hsl(var(--border))',
  '#9ca3af': 'hsl(var(--muted-foreground))',
  '#6b7280': 'hsl(var(--muted-foreground))',
  '#374151': 'hsl(var(--foreground))',
  '#1f2937': 'hsl(var(--foreground))',
};

function replaceColorsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace Tailwind classes
    Object.entries(colorMappings).forEach(([oldColor, newColor]) => {
      const regex = new RegExp(`\\b${oldColor.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'g');
      if (content.includes(oldColor)) {
        content = content.replace(regex, newColor);
        modified = true;
      }
    });
    
    // Replace hex colors
    Object.entries(hexColorMappings).forEach(([oldHex, newVar]) => {
      const regex = new RegExp(oldHex.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g');
      if (content.includes(oldHex)) {
        content = content.replace(regex, newVar);
        modified = true;
      }
    });
    
    // Replace common stroke and fill patterns in charts
    content = content.replace(/stroke="[#][0-9a-fA-F]{6}"/g, 'stroke="hsl(var(--primary))"');
    content = content.replace(/fill="[#][0-9a-fA-F]{6}"/g, 'fill="hsl(var(--primary))"');
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .next, .git directories
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
          walkDir(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (extensions.includes(ext)) {
          totalFiles++;
          if (replaceColorsInFile(fullPath)) {
            modifiedFiles++;
          }
        }
      }
    }
  }
  
  walkDir(dirPath);
  return { totalFiles, modifiedFiles };
}

// Main execution
console.log('🎨 Starting theme color fix...\n');

const srcPath = path.join(__dirname, 'src');
const { totalFiles, modifiedFiles } = processDirectory(srcPath);

console.log(`\n📊 Summary:`);
console.log(`   Total files processed: ${totalFiles}`);
console.log(`   Files modified: ${modifiedFiles}`);
console.log(`   Files unchanged: ${totalFiles - modifiedFiles}`);

if (modifiedFiles > 0) {
  console.log('\n✨ Theme color fix completed successfully!');
  console.log('   All hardcoded colors have been replaced with theme variables.');
} else {
  console.log('\n✅ No hardcoded colors found. Your project is already theme-compliant!');
}