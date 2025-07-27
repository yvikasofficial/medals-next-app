# Medal Count App

A Next.js application that displays Olympic medal counts with sortable columns and dynamic data fetching.

## 🔗 Live Demo

[Deployed Link](YOUR_DEPLOYMENT_URL_HERE)

## 🛠️ Tools & Technologies

- **Next.js 15.4.4** - React framework
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **TailwindCSS 4** - Styling
- **AG Grid** - Data table with sorting
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Radix UI** - UI components
- **Lucide React** - Icons
- **ESLint** - Code linting

## ✅ Take-Home Test Checkpoints

### Core Requirements

- [x] **Time-boxed to 3 hours**
- [x] **URL parameter support** - `?sort=total|gold|silver|bronze`
- [x] **Default sorting** - Defaults to gold medals
- [x] **Proper tie-breaking rules** implemented for all sort types
- [x] **Clickable column headers** for re-sorting
- [x] **No re-fetching** on sort changes (client-side sorting)
- [x] **Flag rendering** using provided flags.png sprite
- [x] **Dynamic data loading** via Ajax call simulation
- [x] **Error handling** for API failures
- [x] **Design implementation** matching provided examples

### Technical Requirements

- [x] **TypeScript & React** implementation
- [x] **Next.js** framework
- [x] **Git tracking** with proper commit structure
- [x] **Separation of concerns** and loose coupling architecture
- [x] **Production-ready** code structure

### Architecture Highlights

- [x] **Component structure** - Modular components with clear responsibilities
- [x] **Custom hooks** - Data fetching and state management
- [x] **Type safety** - Comprehensive TypeScript interfaces
- [x] **Error boundaries** - Graceful error handling
- [x] **Responsive design** - Mobile-friendly layout

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏅 Medal Sorting Functionality

The app supports sorting by any medal type using URL parameters or clickable column headers:

- **Gold** (default) - `?sort=gold`
- **Silver** - `?sort=silver`
- **Bronze** - `?sort=bronze`
- **Total** - `?sort=total`

**Tie-breaking:** When countries have equal counts, ties are broken by other medal types (prioritizing gold → silver → bronze) and finally by country name alphabetically.

**Examples:**

- `localhost:3000?sort=total` - Sort by total medals
- `localhost:3000?sort=silver` - Sort by silver medals

## 📁 Project Structure
