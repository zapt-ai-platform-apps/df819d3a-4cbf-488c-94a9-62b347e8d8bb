import { supabase } from '../supabaseClient';
import { useNavigate, useLocation } from '@solidjs/router';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const isAppRoute = location.pathname === '/app';

  return (
    <header class={`${isAppRoute ? 'bg-white shadow-md' : 'bg-transparent'} sticky top-0 z-10`}>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1
            class={`text-2xl font-bold cursor-pointer ${
              isAppRoute ? 'text-gray-800' : 'text-white'
            }`}
            onClick={handleLogoClick}
          >
            Personalised Learning
          </h1>
          <button
            class={`bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow cursor-pointer transition duration-300 ease-in-out ${
              isAppRoute ? '' : ''
            }`}
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