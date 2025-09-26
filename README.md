# fitnova Challenge

A gamified fitness challenge platform that allows users to participate in challenges, track progress, earn points, and redeem rewards.

## Project Structure

```
fitnova-challenge/
│
├── frontend/                     # React + Tailwind app (user + admin UI)
│   ├── public/                    # Static assets (favicon, logos, manifest)
│   ├── src/
│   │   ├── assets/                # Images, icons, videos
│   │   ├── components/            # Shared reusable components
│   │   ├── features/              # Feature-specific modules
│   │   │   ├── onboarding/        # Welcome, registration, intro
│   │   │   ├── dashboard/         # Challenge list, detail views
│   │   │   ├── leaderboard/       # Leaderboard UI
│   │   │   ├── rewards/           # Prize & redemption views
│   │   │   ├── gallery/           # User photo gallery
│   │   │   └── admin/             # Admin UI pages
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Page-level components (route entry points)
│   │   ├── routes/                # App routing config
│   │   ├── services/              # API calls, Firebase, Cloudinary utils
│   │   ├── store/                 # State management (Redux/Zustand/Context)
│   │   ├── styles/                # Tailwind + custom styles
│   │   ├── utils/                 # Helpers (formatting, validations, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                       # Node.js + Express + Socket.io API
│   ├── src/
│   │   ├── config/                 # Env vars, database config
│   │   ├── controllers/            # Route handlers
│   │   ├── middleware/             # Auth, validation, error handling
│   │   ├── models/                 # DB models (PostgreSQL/Sequelize or Firebase wrappers)
│   │   ├── routes/                 # API endpoints
│   │   ├── services/               # Business logic (points, QR validation, leaderboard)
│   │   ├── sockets/                 # Socket.io event handlers
│   │   ├── utils/                   # Helper functions
│   │   └── index.js                 # Entry point
│   ├── package.json
│   └── .env.example
│
├── shared/                        # Optional: Shared constants/types/utils
│   ├── constants/
│   ├── types/
│   └── utils/
│
├── docs/                          # Documentation & PRD files
│   ├── PRD.md
│   └── wireframes/
│
├── .gitignore
├── README.md
└── package.json                   # If managing as monorepo with scripts
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend

```bash
# Install root dependencies (if using as monorepo)
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Application

```bash
# Start frontend development server
cd frontend
npm run dev

# Start backend server
cd ../backend
npm run dev
```

## Features

- User registration and authentication
- Challenge participation and tracking
- Real-time leaderboard
- Point system and rewards
- Admin dashboard for challenge management
- User photo gallery

## License

MIT