import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SubtopicPage from './pages/Subtopic';
import CreateSubtopic from './pages/CreateSubtopic';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import PostDetail from './pages/PostDetail';
import { TranslationProvider } from './context/TranslationContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/s/:slug" element={<SubtopicPage />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/create-subtopic" element={<CreateSubtopic />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                
                {/* Fallback route */}
                <Route path="*" element={
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      404 - Página não encontrada
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      A página que você está procurando não existe.
                    </p>
                  </div>
                } />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
};

export default App;