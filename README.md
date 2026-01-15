# 💰 FinancePro - Smart Wealth Management

[![View Live Site](https://img.shields.io/badge/View_Live_Site-4F46E5?style=for-the-badge&logo=vercel&logoColor=white)]([https://financepro-demo.vercel.app](https://umidjon0339.github.io/FinancePro-WebApp/))


## 🚀 Overview
**FinancePro** is a modern, hybrid personal finance application designed to help users track expenses, incomes, and budgets. 

It features a unique **Hybrid Architecture**: users can start immediately in **Guest Mode** (data saved locally) and seamlessly upgrade to **Cloud Mode** (data synced to PostgreSQL via Supabase) by signing in. The UI is built with a trendy **Glassmorphism** design language, ensuring a premium user experience on both desktop and mobile.

## ✨ Key Features

-   **☁️ Hybrid Data Sync:** -   **Guest Mode:** Works offline, saves data to Browser LocalStorage.
    -   **Cloud Mode:** Syncs data securely to the cloud when logged in.
-   **🔐 Secure Authentication:** Username/Password login with Row Level Security (RLS) ensuring users only see their own data.
-   **📊 Visual Analytics:** Interactive Pie Charts (Expense breakdown) and Bar Charts (Monthly cash flow).
-   **💸 Smart Budgeting:** Visual budget tracker with "Safe to Spend" indicators.
-   **🎨 Modern UI:** Fully responsive Glassmorphism design with Dark/Light mode support.
-   **📂 Data Management:** Filter, Search, Sort, and Export transactions to CSV.

## 🛠️ Tech Stack

-   **Frontend:** React, TypeScript, Vite
-   **Styling:** CSS3 (Variables, Glassmorphism effects), Lucide React (Icons)
-   **Backend/DB:** Supabase (PostgreSQL, Auth)
-   **Visualization:** Recharts
-   **Routing:** React Router DOM
-   **Notifications:** React Hot Toast
