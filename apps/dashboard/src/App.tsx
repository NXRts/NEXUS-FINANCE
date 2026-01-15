import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

import { IncomePage } from "./pages/IncomePage";
import { ExpensePage } from "./pages/ExpensePage";
import { CategoryPage } from "./pages/CategoryPage";
import { UserPage } from "./pages/UserPage";
import { ReportsPage } from './pages/ReportsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
            <DashboardLayout>
                <DashboardPage />
            </DashboardLayout>
        } />
        <Route path="/pemasukan" element={
            <DashboardLayout>
                <IncomePage />
            </DashboardLayout>
        } />
        <Route path="/pengeluaran" element={
            <DashboardLayout>
                <ExpensePage />
            </DashboardLayout>
        } />
        <Route path="/kategori" element={
            <DashboardLayout>
                <CategoryPage />
            </DashboardLayout>
        } />
        <Route path="/reports" element={
            <DashboardLayout>
                <ReportsPage />
            </DashboardLayout>
        } />
        <Route path="/user" element={
            <DashboardLayout>
                <UserPage />
            </DashboardLayout>
        } />
        {/* Redirect unknown routes to login or dashboard. 
            Ideally we would check auth state, but for now redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
