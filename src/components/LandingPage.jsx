import { useNavigate } from '@solidjs/router';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div class="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
      <div class="max-w-4xl mx-auto text-center p-8">
        <h1 class="text-5xl font-bold mb-6">Welcome to Personalised Learning</h1>
        <p class="text-xl mb-8">
          Empowering students with tailored educational support for enhanced learning experiences.
        </p>
        <button
          class="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default LandingPage;