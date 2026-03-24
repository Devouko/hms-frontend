@echo off
echo Fixing motion imports...

powershell -Command "(Get-Content 'src\components\*.tsx' -Raw) -replace \"import { motion } from 'motion/react';\", \"import { motion } from 'motion';\" | Set-Content 'src\components\*.tsx'"
powershell -Command "(Get-Content 'src\components\*.tsx' -Raw) -replace \"import { motion, AnimatePresence } from 'motion/react';\", \"import { motion, AnimatePresence } from 'motion';\" | Set-Content 'src\components\*.tsx'"
powershell -Command "(Get-Content 'src\components\setup\*.tsx' -Raw) -replace \"import { motion } from 'motion/react';\", \"import { motion } from 'motion';\" | Set-Content 'src\components\setup\*.tsx'"

echo Motion imports fixed!
pause