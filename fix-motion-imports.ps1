# Fix Motion Imports Script
Write-Host "Fixing motion imports..." -ForegroundColor Green

# Get all TypeScript React files
$files = Get-ChildItem -Path "src" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $originalContent = $content
        
        # Replace motion imports
        $content = $content -replace "import { motion } from 'motion/react';", "import { motion } from 'framer-motion';"
        $content = $content -replace "import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'framer-motion';"
        $content = $content -replace "import { motion } from 'motion';", "import { motion } from 'framer-motion';"
        $content = $content -replace "import { motion, AnimatePresence } from 'motion';", "import { motion, AnimatePresence } from 'framer-motion';"
        
        # Only write if content changed
        if ($content -ne $originalContent) {
            Set-Content $file.FullName $content -ErrorAction Stop
            Write-Host "Fixed: $($file.FullName)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Skipped (in use): $($file.FullName)" -ForegroundColor Red
    }
}

Write-Host "Motion import fix completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm install framer-motion" -ForegroundColor White
Write-Host "2. Restart your development server" -ForegroundColor White