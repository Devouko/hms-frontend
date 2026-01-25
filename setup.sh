#!/bin/bash

# Hospital Management System Setup Script
echo "🏥 SmartCare Hospital Management System Setup"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create sample data (optional)
echo ""
echo "🔧 Setup Options:"
echo "1. Start with sample data (recommended for testing)"
echo "2. Start with empty system"
read -p "Choose option (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo "📊 Creating sample data..."
    # This would run a script to populate localStorage with sample data
    # For now, we'll just create a flag file
    touch .sample-data-enabled
    echo "✅ Sample data will be loaded on first run"
fi

# Check for Supabase configuration
if [ -f "src/utils/supabase/info.tsx" ]; then
    echo ""
    echo "🔍 Supabase configuration detected"
    echo "   Make sure to update your Supabase credentials if needed"
    echo "   See DATABASE_SETUP.md for detailed instructions"
else
    echo ""
    echo "⚠️  No Supabase configuration found"
    echo "   System will use localStorage for data persistence"
    echo "   This is fine for development and testing"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:5173 in your browser"
echo "3. Create your first admin account"
echo "4. Configure hospital settings in System Settings"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Basic usage"
echo "   - DEPLOYMENT_GUIDE.md - Production deployment"
echo "   - DATABASE_SETUP.md - Database configuration"
echo ""
echo "🚀 Ready to launch your hospital management system!"