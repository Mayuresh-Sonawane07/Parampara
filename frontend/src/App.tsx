import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { TraditionDetailPage } from './pages/TraditionDetailPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { WarliARPage } from './pages/WarliARPage';
import { QuizPage } from './pages/QuizPage';
import { PostersPage } from './pages/PostersPage';
import { ContributePage } from './pages/ContributePage';
import { SourcesPage } from './pages/SourcesPage';
import { AboutPage } from './pages/AboutPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ScanRouterPage } from './pages/ScanRouterPage';
import { ContributorAuthPage } from './pages/ContributorAuthPage';
import { ContributorDashboardPage } from './pages/ContributorDashboardPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 selection:bg-orange-200 selection:text-orange-950 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/tradition/:slug" element={<TraditionDetailPage />} />
            <Route path="/tradition/:slug/experience" element={<ExperiencePage />} />
            <Route path="/tradition/warli/ar" element={<WarliARPage />} />
            <Route path="/tradition/:slug/quiz" element={<QuizPage />} />
            <Route path="/quizzes" element={<QuizPage />} />
            <Route path="/posters" element={<PostersPage />} />
            <Route path="/contribute" element={<ContributePage />} />
            <Route path="/contributor/login" element={<ContributorAuthPage />} />
            <Route path="/contributor/register" element={<ContributorAuthPage />} />
            <Route path="/contributor/dashboard" element={<ContributorDashboardPage />} />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/scan/:slug" element={<ScanRouterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
