import { useLocation } from '@solidjs/router';

function Footer() {
  const location = useLocation();
  const isAppRoute = location.pathname === '/app';

  return (
    <footer class={`mt-8 text-center ${isAppRoute ? 'text-gray-800' : 'text-white'}`}>
      <p>© 2024 Personalised Learning. All rights reserved.</p>
      <p>
        Made on{' '}
        <a
          href="https://www.zapt.ai"
          target="_blank"
          rel="noopener noreferrer"
          class={`font-semibold hover:underline ${
            isAppRoute ? 'text-blue-600' : 'text-white'
          }`}
        >
          ZAPT
        </a>
      </p>
    </footer>
  );
}

export default Footer;