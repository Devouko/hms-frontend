import { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Sparkles } from 'lucide-react';
import { AIAssistant } from './AIAssistantRobust';

interface FloatingAIButtonProps {
  currentPage?: string;
  userRole?: string;
}

export function FloatingAIButton({ currentPage, userRole }: FloatingAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(56, 189, 248, 0.3)',
            '0 0 30px rgba(56, 189, 248, 0.5)',
            '0 0 20px rgba(56, 189, 248, 0.3)'
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
      >
        <div className="relative">
          <Bot className="size-6" />
          <Sparkles className="size-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>
      </motion.button>

      <AIAssistant
        currentPage={currentPage}
        userRole={userRole}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
    </>
  );
}