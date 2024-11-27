import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [question, setQuestion] = createSignal('');
  const [answer, setAnswer] = createSignal('');
  const [feedback, setFeedback] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };
  
  onMount(checkUserSignedIn);
  
  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });
    
    return () => {
      authListener.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (question()) {
      setCurrentPage('answerPage');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (answer()) {
      setLoading(true);
      try {
        const result = await createEvent('chatgpt_request', {
          prompt: `The student asked the question: "${question()}". They answered: "${answer()}". Check if the answer is correct. If correct, respond: "Great job!". If not, guide the student to understand how to answer the question correctly without stating the answer directly.`,
          response_type: 'text'
        });
        setFeedback(result);
        setCurrentPage('feedbackPage');
      } catch (error) {
        console.error('Error checking answer:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <Show
        when={currentPage() === 'homePage' || currentPage() === 'answerPage' || currentPage() === 'feedbackPage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                view="magic_link"
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-2xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">Personalised Learning</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
          <Show when={currentPage() === 'homePage'}>
            <form onSubmit={handleSubmitQuestion} class="space-y-4">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Enter Your Question</h2>
              <textarea
                placeholder="Type your question here..."
                value={question()}
                onInput={(e) => setQuestion(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                required
              />
              <button
                type="submit"
                class="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                Submit Question
              </button>
            </form>
          </Show>
          <Show when={currentPage() === 'answerPage'}>
            <form onSubmit={handleSubmitAnswer} class="space-y-4">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Your Question</h2>
              <p class="bg-white p-4 rounded-lg shadow-md">{question()}</p>
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Enter Your Answer</h2>
              <textarea
                placeholder="Type your answer here..."
                value={answer()}
                onInput={(e) => setAnswer(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                required
              />
              <button
                type="submit"
                class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading()}
              >
                <Show when={loading()} fallback="Submit Answer">
                  Checking...
                </Show>
              </button>
            </form>
          </Show>
          <Show when={currentPage() === 'feedbackPage'}>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">Feedback</h2>
            <div class="bg-white p-4 rounded-lg shadow-md">
              <p class="text-gray-700 whitespace-pre-wrap">{feedback()}</p>
            </div>
            <button
              class="mt-4 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => {
                setQuestion('');
                setAnswer('');
                setFeedback('');
                setCurrentPage('homePage');
              }}
            >
              New Question
            </button>
          </Show>
          <p class="mt-8 text-center text-gray-600">
            Made on <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">ZAPT</a>
          </p>
        </div>
      </Show>
    </div>
  );
}

export default App;