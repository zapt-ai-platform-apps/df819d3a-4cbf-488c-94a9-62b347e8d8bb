import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [user, setUser] = createSignal(null);

  onMount(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    onCleanup(() => {
      authListener?.unsubscribe();
    });
  });

  return (
    <div class="min-h-screen bg-gray-50 text-gray-800">
      <Show when={user()} fallback={<Auth />}>
        <>
          <Header />
          <MainContent />
          <Footer />
        </>
      </Show>
    </div>
  );
}

export default App;