# Ria Money Transfer - Currency Exchange Dashboard

A currency exchange dashboard application built with Next.js 14+ (App Router) and TypeScript. Designed for Ria Money Challenge, this app provides real-time exchange rates, currency conversion tools, and historical trend analysis to help users make informed decisions when sending money internationally.

## Setup Instructions

### Requirements
- Node.js 18 or 20
- npm or yarn

### Commands

```bash
cd ria_money_app

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

The `build` command generates a static export in the `/out` directory, ready for static hosting.

**Live Demo**: [https://wondrous-malasada-4c4dc7.netlify.app/](https://wondrous-malasada-4c4dc7.netlify.app/)

## Innovation Feature: Trend Analysis 

The **Trend Analysis** page (`/trend`) is the main innovation feature. It allows users to analyze historical exchange rate trends with two modes:

1. **Date Range Mode**: Analyzes trends between a start and end date, calculating:
   - `deltaPct`: Total percentage change over the period
   - `avgDailyChangePct`: Average daily percentage change

2. **Single Date Mode**: Compares a selected historical date with today's rates


### Features
- Visual indicators: `+` (base stronger), `−` (base weaker), `0` (no significant change)
- Sortable results (highest increase, highest decrease, alphabetical)
- Shows initial and final values for each currency
- Clear disclaimer that this is historical analysis, not prediction

## AI Usage

This website was created using the free trial version of Cursor because many developers recommended it to me, and I took advantage of this project to build it from scratch.

AI was used in this project for:
- **Code generation**: The agent created the project's foundation from a promt and also made specific changes to various parts of the code.
- **Documentation**: Assistance in creating clear, structured documentation

AI served as a pair programming assistant, helping to maintain code quality, consistency, and best practices throughout development.

## Assumptions & Trade-offs

### Assumptions
- Date range for trends is limited to 2021-01-01 onwards (It was not relevant go further)
- Users understand that trend analysis is historical and not predictive

### Trade-offs
- **No caching**: Each request hits the API directly for simplicity and to ensure fresh data
- **CSS Modules over Tailwind**: Used CSS Modules for component-scoped styling to maintain better control

## What I Would Improve with More Time

1. **Data Visualization**: Add interactive charts/graphs (using something like D3 but for typescript) to visualize trend data more effectively