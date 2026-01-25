# SmartCare Hospital Management System (Next.js)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Overview

SmartCare is a comprehensive hospital management system built with Next.js, React, and TypeScript. It provides a complete solution for managing hospital operations including patient care, appointments, billing, inventory, and staff management.

## ✨ Features

### Core Modules
- 🏥 **Patient Management** - Complete patient records and history
- 📅 **Appointment Scheduling** - Advanced booking system
- 💰 **Billing & Payments** - Invoice generation and payment processing
- 👨‍⚕️ **Doctor Management** - Doctor profiles and schedules
- 💊 **Pharmacy** - Medication inventory and dispensing
- 🔬 **Laboratory** - Test management and results
- 🏥 **Inpatient/Outpatient** - Patient workflow management
- 🚑 **Emergency Management** - Emergency case handling

### Specialized Departments
- 👶 **Gynecology** - Women's healthcare management
- 🩺 **Nursing Station** - Patient care coordination
- 🩸 **Blood Bank** - Blood inventory management
- 🛏️ **Bed Management** - Hospital bed allocation

### Administrative Features
- 👥 **User Management** - Role-based access control
- 📊 **Statistics & Reports** - Comprehensive analytics
- 💼 **Employee Management** - Staff records and payroll
- 📦 **Inventory Management** - Medical supplies tracking
- 🚗 **Vehicle Management** - Ambulance fleet management
- 💬 **Complaint Management** - Patient feedback system

### Advanced Features
- 🤖 **AI Assistant** - Intelligent help system
- 🌓 **Dark/Light Theme** - Customizable interface
- 🔔 **Real-time Notifications** - Instant updates
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔒 **Secure Authentication** - Supabase integration

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Supabase account (for backend)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Hospital Management System (4)"
```

2. **Run the setup script**
```bash
setup-nextjs.bat
```

Or manually:

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── AuthPage.tsx      # Authentication
│   ├── MainApp.tsx       # Main application
│   ├── Dashboard.tsx     # Dashboard views
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── styles/               # Global styles
└── utils/                # Helper functions
    └── supabase/         # Supabase client
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Supabase Setup

1. Create a Supabase project
2. Set up authentication
3. Configure database tables
4. Update environment variables

See `DATABASE_SETUP.md` for detailed instructions.

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15.1.6
- **UI Library**: React 18.3.1
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.17
- **Components**: Radix UI, shadcn/ui
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

### Development Tools
- **Linting**: ESLint
- **Formatting**: Prettier (recommended)
- **Type Checking**: TypeScript

## 👥 User Roles

1. **Super Admin** - Full system access
2. **Admin** - Administrative functions
3. **Doctor** - Patient care and medical records
4. **Nurse** - Patient care coordination
5. **Pharmacist** - Medication management
6. **Lab Technician** - Laboratory operations
7. **Receptionist** - Front desk operations
8. **User** - Basic access

## 🔐 Security Features

- ✅ Role-based access control (RBAC)
- ✅ Secure authentication with Supabase
- ✅ Environment variable protection
- ✅ Input validation and sanitization
- ✅ Secure API routes
- ✅ Session management

## 📱 Responsive Design

- ✅ Desktop (1920px+)
- ✅ Laptop (1024px - 1919px)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)

## 🎨 Theming

The application supports both light and dark themes with:
- System preference detection
- Manual theme switching
- Persistent theme selection
- Smooth transitions

## 📊 Performance

- ⚡ Server-Side Rendering (SSR)
- ⚡ Static Site Generation (SSG)
- ⚡ Automatic code splitting
- ⚡ Image optimization
- ⚡ Lazy loading
- ⚡ Optimized bundle size

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

## 📚 Documentation

- [Migration Guide](NEXTJS_MIGRATION_GUIDE.md)
- [Database Setup](DATABASE_SETUP.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [RBAC Implementation](RBAC_IMPLEMENTATION.md)
- [Quick Start](QUICK_START.md)

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config
- **Comments**: JSDoc for all major functions
- **Naming**: camelCase for variables, PascalCase for components
- **File Structure**: Feature-based organization

## 🐛 Troubleshooting

### Common Issues

**Issue**: Module not found
```bash
npm install
```

**Issue**: Port already in use
```bash
# Change port in package.json or kill process
npx kill-port 3000
```

**Issue**: Build errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Authors

SmartCare Development Team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- Supabase for backend infrastructure
- shadcn/ui for beautiful UI components

## 📞 Support

For support, email support@smartcare.com or open an issue in the repository.

## 🔄 Version History

- **1.0.0** (2024) - Initial Next.js release
  - Migrated from Vite to Next.js
  - All features preserved
  - Performance improvements
  - Enhanced documentation

---

Made with ❤️ by SmartCare Team
