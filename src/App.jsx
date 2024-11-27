import { createSignal, onMount, onCleanup } from 'solid-js';
import { supabase } from './supabaseClient';
import { Routes, Route, useNavigate, useLocation } from '@solidjs/router';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  const [user, setUser] = createSignal(null);
  const navigate = useNavigate();
  const location = useLocation();

  onMount(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        navigate('/app');
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/app');
      } else {
        setUser(null);
        // Removed automatic navigation to '/auth' to allow access to the landing page
      }
    });

    onCleanup(() => {
      authListener?.unsubscribe();
    });
  });

  return (
    <div
      class={`min-h-screen ${
        location.pathname === '/app'
          ? 'bg-white text-gray-800'
          : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
      }`}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute user={user}>
              <Header />
              <MainContent />
              <Footer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;