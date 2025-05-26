# 🛡️ CSDS Frontend

Cyber Security Dashboard System (CSDS) is a frontend application built with Next.js and Tailwind CSS, designed to provide an intuitive interface for managing and visualizing cybersecurity incidents.

## 🚀 Features
	•	Incident Reporting: Submit and track cybersecurity incidents with detailed information.
	•	Dashboard Visualization: Interactive dashboards to monitor incident trends and statuses.
	•	User Management: Role-based access control for administrators and analysts.
	•	Real-time Updates: Stay informed with live updates on incident statuses.

## 🧰 Tech Stack
	•	Framework: Next.js
	•	Styling: Tailwind CSS
	•	Language: TypeScript
	•	Package Manager: pnpm
	•	Linting: ESLint

## Installation
```
git clone https://github.com/HydrogenUkraine/H2U-Marketplace.git
cd H2U-Marketplace
pnpm install
pnpm run dev
```

## 📁 Project Structure
```
csds/
├── app/                # Application pages and routing
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks, including jotai hooks
├── lib/                # Utility functions and API clients + jotai actions
├── public/             # Static assets
├── styles/             # Global and component-specific styles
├── utils/              # Utility functions
├── .eslintrc.json      # ESLint configuration
├── next.config.mjs     # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project metadata and scripts
```