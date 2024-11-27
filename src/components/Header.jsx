import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function Header() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header class="bg-white shadow-md sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1
            class="text-2xl font-bold text-indigo-600 cursor-pointer"
            onClick={handleLogoClick}
          >
            Personalised Learning
          </h1>
          <button
            class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow cursor-pointer transition duration-300 ease-in-out"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;