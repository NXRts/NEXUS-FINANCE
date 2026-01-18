# 💰 Finance Dashboard

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

A comprehensive, modern, and responsive **Finance Dashboard** application built to help you track incomes, expenses, and analyze your financial growth with style. 🚀

---

## ✨ Features

### 📊 Interactive Dashboard
-   **Real-time Overview**: Instant snapshot of your total balance, income, and expenses.
-   **Visual Analytics**: dynamic charts providing deep insights into your financial health.

### 📈 Advanced Reporting
-   **Trend Analysis**: Interactive Area Charts showing Income vs. Expense over time.
-   **Category Breakdown**: Beautiful Pie Charts visualizing where your money goes.
-   **Monthly Net Growth**: Bar charts with **custom-styled tooltips** for detailed monthly breakdown (In/Out/Net).
-   **KPI Tracking**: Month-over-Month (MoM) performance indicators for Income, Expense, Savings, and Savings Rate.
-   **Data Export**: Export your financial reports to CSV with a single click.

### 💸 Transaction Management
-   **Expenses & Incomes**: Easily add, edit, and delete financial records.
-   **Smart Filtering**: Filter transactions by date range or category.
-   **Local Persistence**: All data is securely stored in your browser's Local Storage.

### 👥 User Management
-   **Team Collaboration**: Invite and manage team members.
-   **Role-Based Access**: Assign roles (Admin, Manager, User) and statuses.
-   **Profile Management**: Dedicated user profile pages with activity feeds.

### 🎨 Premium UI/UX
-   **Dark Mode Support**: Sleek and eye-friendly dark mode (system compliant).
-   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile experiences.
-   **Glassmorphism Effects**: Modern polished aesthetics using Tailwind CSS.

---

## 🛠️ Tech Stack

-   **Frontend Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & `clsx` / `tailwind-merge`
-   **Data Visualization**: [Recharts](https://recharts.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Routing**: [React Router DOM](https://reactrouter.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

-   **Node.js** (v18 or higher)
-   **pnpm** (recommended) or npm/yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/finance-dashboard.git
    cd finance-dashboard
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    ```

3.  **Start the Development Server**
    ```bash
    pnpm dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` to see the app in action!

### 💾 Data Persistence
All data is stored in your browser's **LocalStorage**. 
- To **reset** your data completely, clear your browser's application storage or run `localStorage.clear()` in the console.
- Data will not sync across different browsers or devices.

---

## 📂 Project Structure

```bash
src/
├── components/      # Reusable UI components (Layout, Sidebar, Navbar)
├── lib/             # Utilities (Storage, Formatting helpers)
├── pages/           # Application views (Dashboard, Reports, Users, etc.)
├── types/           # TypeScript interfaces and type definitions
├── App.tsx          # Main application component & Routing
└── main.tsx         # Entry point
```

---

## 📝 Usage Guide

1.  **Dashboard**: Landing page with summary cards.
2.  **Transactions**: Navigate to "Incomes" or "Expenses" to log your data.
3.  **Reports**: Go to "Reports" to analyze trends. Hover over charts to see detailed **tooltips**.
4.  **Users**: Manage your team in the "Users" section. Use the "Invite User" button to add new members.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use and modify it for your personal or commercial projects.

---

Made with ❤️ by NXRts
