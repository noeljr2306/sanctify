# ✝️ Sanctify – Catholic Faith App

> 🚧 **Under Construction** — A deeply personal, liturgically-aware Catholic companion app for iOS, Android, and Web.

**Sanctify** is a comprehensive mobile application designed to deepen Catholic faith through daily prayer, spiritual formation, and community connection. The entire experience is dynamically adapted to the liturgical season, creating an immersive and spiritually attuned companion for daily spiritual practices.

---

## 📖 Table of Contents

- [About Sanctify](#about-sanctify)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Architecture & Design](#architecture--design)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Build](#development-build)
- [Contributing](#contributing)

---

## 🎯 About Sanctify

**Sanctify** is a mobile app designed to help Catholics pray, grow in faith, and live in harmony with the rhythms of the Church year — right from their phone. Everything adapts to the liturgical season, making faith a natural, integrated part of daily life.

### Why Sanctify?

- **Liturgically-Aware**: Content changes daily based on the Catholic liturgical calendar
- **Comprehensive**: All-in-one prayer, formation, and community platform
- **Beautiful Design**: Seasonal theming that respects Catholic liturgical colors
- **Community-Focused**: Connect with other Catholics through prayer walls and shared practices
- **Family-Friendly**: Includes features for children and family prayer
- **Accessible**: Works seamlessly across iOS, Android, and Web

---

## ✨ Core Features

- 📅 **Liturgical Calendar** — Dynamic seasonal theming (Purple/White/Green/Red) aligned with Church year
- 🙏 **Prayer Hub** — Rosary modes, Daily Prayers, Divine Mercy Chaplet, Liturgy of the Hours
- 📖 **Daily Mass Readings** — Lectio Divina meditation mode with daily gospel and readings
- 🕯️ **Confession Preparation** — Examination of conscience guides, Act of Contrition, confessor finder
- 📿 **Sacramental Life Tracker** — Track baptism, confirmation, marriage anniversaries and spiritual milestones
- 🎙️ **Faith Formation** — Catechism of the Day, Catholic Q&A, doctrine explainers, interactive quizzes
- 🕍 **Parish Directory** — Locate nearby parishes, Mass times, adoration chapels, confessor availability
- 👨‍👩‍👧 **Family Features** — Family rosary mode, children's prayers, shared family calendar
- 🔔 **Smart Notifications** — Angelus bell, daily readings, Saint of the Day, reminder alerts
- 🌍 **Community Features** — Prayer wall, prayer intentions, adoration scheduling, pilgrimage tracker

---

## 🛠️ Technology Stack

### Frontend Stack

| Layer                | Technology                  | Purpose                                          |
| -------------------- | --------------------------- | ------------------------------------------------ |
| **Framework**        | React Native + Expo         | Cross-platform mobile (iOS/Android/Web)          |
| **Language**         | TypeScript                  | Type-safe, production-grade code                 |
| **Routing**          | Expo Router                 | File-based routing, navigation management        |
| **Styling**          | Tailwind CSS                | Responsive, utility-first styling with dark mode |
| **State Management** | Zustand (via custom stores) | Lightweight, modular state management            |
| **HTTP Client**      | Native Fetch API            | API communication                                |

### Backend & Services

| Service          | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| **Supabase**     | PostgreSQL database, authentication, real-time updates         |
| **Readings API** | Integration for daily Mass readings                            |
| **Native APIs**  | Notifications (local & push), haptic feedback, calendar access |

### Development Tools

| Tool                    | Purpose                                |
| ----------------------- | -------------------------------------- |
| **ESLint**              | Code linting and style consistency     |
| **TypeScript Compiler** | Type checking and compilation          |
| **Expo CLI**            | Build, test, and deployment management |
| **Gradle**              | Android build and compilation          |

---

## 🏗️ Architecture & Design

### Design Philosophy

Sanctify follows a **modular, feature-driven architecture** based on Expo Router's file-based routing pattern:

```
📱 App Structure
├── 🗺️ Routing Layer (Expo Router)
│   └── File-based navigation (automatic route generation)
├── 📑 Feature Modules (organized by feature)
│   ├── Prayer (daily prayers, rosary, chaplets)
│   ├── Confession (examination, finder)
│   ├── Formation (catechism, Q&A, quiz)
│   ├── Community (prayer wall, parishes, adoration)
│   ├── Seasonal (Advent, Lent, special chaplets)
│   └── Readings (daily Mass readings)
├── 🎭 Theming Layer
│   ├── Seasonal color schemes
│   ├── Liturgical color system
│   └── Dark mode support
└── 📊 State Management (Zustand stores)
    ├── Auth (user authentication)
    ├── Prayer (prayer history & favorites)
    ├── Journal (spiritual journaling)
    ├── Confession (confession tracking)
    ├── Notifications (notification state)
    ├── Readings (cached readings)
    ├── Seasonal (seasonal data)
    └── Theme (theme preferences)
```

### Key Design Patterns

1. **Feature-Based Organization** — Each tab/feature is self-contained with its own screens and state
2. **Centralized State** — Zustand stores provide predictable state management
3. **Type Safety** — TypeScript enforces contracts across components
4. **Constants-Driven** — Prayer content, catechism, Q&A all defined in `/constants`
5. **Seasonal Adaptation** — All UI/UX dynamically adapts to liturgical color and season
6. **Utility-First Styling** — Tailwind CSS for consistent, maintainable design

---

## 📁 Project Structure

```
sanctify/
├── app/                          # Expo Router app directory (contains routes)
│   ├── _layout.tsx              # Root layout with navigation structure
│   ├── auth.tsx                 # Authentication screen
│   ├── (tabs)/                  # Tab navigator routes
│   │   ├── index.tsx            # Home/Dashboard
│   │   ├── prayers.tsx          # Prayer hub
│   │   ├── readings.tsx         # Mass readings
│   │   └── more.tsx             # Additional options
│   ├── community/               # Community features
│   │   ├── parishes.tsx         # Parish finder
│   │   ├── adoration.tsx        # Adoration tracker
│   │   └── prayer-wall.tsx      # Prayer wall
│   ├── confession/              # Confession module
│   │   ├── examination.tsx      # Examination of conscience
│   │   ├── finder.tsx           # Confessor finder
│   │   └── walkthrough.tsx      # Confession walkthrough
│   ├── formation/               # Faith formation
│   │   ├── catechism.tsx        # Daily catechism
│   │   ├── qa.tsx              # Catholic Q&A
│   │   ├── quiz.tsx            # Interactive quizzes
│   │   └── journal.tsx         # Spiritual journal
│   ├── prayer/                  # Dynamic prayer pages
│   │   └── [id].tsx            # Individual prayer view
│   └── seasonal/                # Seasonal content
│       ├── advent.tsx           # Advent content & chaplets
│       ├── lent.tsx             # Lenten resources
│       ├── chaplets.tsx         # Special chaplets
│       └── children.tsx         # Children's prayers
│
├── components/                  # Reusable React components
│   ├── ui/                      # Primitive UI components
│   │   ├── collapsible.tsx      # Accordion component
│   │   └── icon-symbol.tsx      # Icon system
│   ├── themed-text.tsx          # Seasonally-themed text
│   ├── themed-view.tsx          # Seasonally-themed container
│   ├── parallax-scroll-view.tsx # Parallax scroll effect
│   └── external-link.tsx        # Link handler
│
├── constants/                   # Content & configuration
│   ├── prayers.ts               # All prayer data
│   ├── prayers.types.ts         # TypeScript prayer types
│   ├── catechism.ts             # Catechism content
│   ├── catholicQA.ts            # Q&A pairs
│   ├── confession.ts            # Examination questions
│   ├── journalPrompts.ts        # Journal writing prompts
│   ├── childrenPrayers.ts       # Kids' prayer content
│   ├── lenten.ts                # Lenten resources
│   ├── advent.ts                # Advent content
│   ├── quiz.ts                  # Quiz questions
│   ├── notifications.ts         # Notification templates
│   ├── roasry.ts                # Rosary structure & mysteries
│   └── theme.ts                 # Theme color definitions
│
├── stores/                      # Zustand state management
│   ├── authStore.ts             # Authentication state
│   ├── prayerStore.ts           # User prayers & favorites
│   ├── journalStore.ts          # Journal entries
│   ├── confessionStore.ts       # Confession history
│   ├── notificationStore.ts     # Notification preferences
│   ├── readingsStore.ts         # Cached Mass readings
│   ├── seasonalStore.ts         # Seasonal state
│   └── themeStore.ts            # Theme preferences
│
├── lib/                         # Utilities & helpers
│   ├── supabase.ts              # Supabase client & auth
│   ├── readingsApi.ts           # Mass readings API
│   ├── notificationScheduler.ts # Notification scheduling
│   └── liturgicalCalendar.ts    # Liturgical calendar logic
│
├── utils/                       # Utility functions
│   └── liturgicalCalendar.ts    # Calendar calculations
│
├── theme/                       # Theme system
│   └── seasonalTheme.ts         # Seasonal color schemes
│
├── types/                       # TypeScript type definitions
│   ├── confession.types.ts      # Confession types
│   ├── journal.types.ts         # Journal types
│   └── reading.types.ts         # Reading types
│
├── hooks/                       # Custom React hooks
│   ├── use-color-scheme.ts      # Dark/light mode detection
│   ├── use-color-scheme.web.ts  # Web-specific color scheme
│   └── use-theme-color.ts       # Seasonal theme hook
│
├── android/                     # Android-specific configuration
│   ├── app/                     # Android app module
│   └── gradle/                  # Gradle build configuration
│
├── assets/                      # Images, fonts, icons
│   └── images/                  # App graphics
│
├── app.json                     # Expo app configuration
├── package.json                 # Node dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── eslint.config.js             # ESLint configuration
└── README.md                    # This file
```

### File Naming Conventions

- **Routes**: kebab-case (e.g., `prayer-wall.tsx`)
- **Components**: PascalCase with .tsx (e.g., `ThemedText.tsx`)
- **Utilities/Stores**: camelCase (e.g., `supabase.ts`, `prayerStore.ts`)
- **Constants**: UPPERCASE or camelCase based on content type
- **Types**: descriptive.types.ts pattern

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+) and npm/yarn
- **Expo CLI** (`npm install -g expo-cli`)
- **Android SDK** (for Android development)
- **Xcode** (for iOS development on macOS)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sanctify

# Install dependencies
npm install

# Configure Supabase environment variables
# Create .env.local with your Supabase credentials
cp .env.example .env.local
```

### Running the App

```bash
# Start the development server
npx expo start

# On your machine, press:
# - 'i' to open iOS simulator (macOS only)
# - 'a' to open Android emulator
# - 'w' to open web version
# - 'r' to reload
# - 'q' to quit
```

### Build for Web

```bash
npx expo export:web
```

---

## 🔨 Development Build

### Android Build

```bash
# Debug build
./android/gradlew -p android assembleDebug

# Release build
./android/gradlew -p android assembleRelease

# Clean build
./android/gradlew -p android clean
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** changes with clear messages (`git commit -m "Add feature"`)
4. **Type-check** your code (`npx tsc --noEmit`)
5. **Lint** your code (`npm run lint`)
6. **Push** to your fork (`git push origin feature/your-feature`)
7. **Open** a Pull Request

### Coding Standards

- Use **TypeScript** — strict mode enabled
- Follow **Tailwind CSS** utility-first approach
- Organize by **feature modules**
- Keep **components small** and focused
- Document **complex logic** with comments
- Add **types** for all functions and components

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

Built with ❤️ for the Catholic community. May Sanctify deepen your faith and bring you closer to Christ through daily prayer and spiritual formation.

Then open in:

- 📱 **iOS Simulator** — Press `i`
- 🤖 **Android Emulator** — Press `a`
- 🌐 **Web** — Press `w`
- 📲 **Expo Go** — Scan QR code on your phone

---

## 📝 Important Notes

✅ **Project Status**

- 🏗️ Under active development
- ⛪ Theological accuracy and Catholic teaching are top priorities
- 📱 Built with React Native for cross-platform reach

✅ **Design Principles**

- 🎨 **Liturgically-Aware** — Everything adapts to the Church calendar
- 🙏 **Spiritually Focused** — Not a distraction, a companion to faith
- 👥 **Community-Centered** — Designed for Catholics at all levels
- 🔐 **Privacy First** — User data security by design

✅ **Vision**

- Create a app that serves the Catholic community authentically
- Make liturgical living accessible and daily
- Support both individual and family prayer
- Integrate sacramental life with modern technology

---

**Built with ❤️ for the Catholic community** ⛪✨
