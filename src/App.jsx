import { createSignal, onMount, onCleanup } from 'solid-js';
import { supabase } from './supabaseClient';
import { Routes, Route, useNavigate } from '@solidjs/router';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [user, setUser] = createSignal(null);
  const navigate = useNavigate();

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
        navigate('/auth');
      }
    });

    onCleanup(() => {
      authListener?.unsubscribe();
    });
  });

  return (
    <div class="min-h-screen bg-gray-50 text-gray-800">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/app" element={
          <>
            <Header />
            <MainContent />
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;