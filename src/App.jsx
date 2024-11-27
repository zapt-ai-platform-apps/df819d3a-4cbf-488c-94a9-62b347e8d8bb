import { createSignal, onMount, Show, onCleanup, For, createEffect, on } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { SolidMarkdown } from 'solid-markdown';

function App() {
  const [user, setUser] = createSignal(null);
  const [question, setQuestion] = createSignal('');
  const [conversation, setConversation] = createSignal([]);
  const [answerInput, setAnswerInput] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [wantsGeneratedQuestion, setWantsGeneratedQuestion] = createSignal(null);
  const [year, setYear] = createSignal('');
  const [subject, setSubject] = createSignal('');
  const [loadingQuestionGeneration, setLoadingQuestionGeneration] = createSignal(false);

  // Declare conversationContainer ref
  let conversationContainer;

  // Authentication
  onMount(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        // Clear any user-specific state when user signs out
        resetState();
      }
    });

    onCleanup(() => {
      authListener?.unsubscribe();
    });
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetState = () => {
    setQuestion('');
    setConversation([]);
    setAnswerInput('');
    setYear('');
    setSubject('');
    setWantsGeneratedQuestion(null);
  };

  // Handle question submission
  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (question()) {
      setConversation([{ role: 'mentor', content: question() }]);
      setAnswerInput('');
    }
  };

  // Handle generating question
  const handleGenerateQuestion = async (e) => {
    e.preventDefault();
    if (year() && subject()) {
      setLoadingQuestionGeneration(true);
      try {
        const result = await createEvent('chatgpt_request', {
          prompt: `Generate a GCSE level question for a UK student in year ${year()} on the subject of ${subject()}. Include any necessary information, and provide the total marks for the question. Format the question appropriately.`,
          response_type: 'text',
        });
        setQuestion(result);
        setConversation([{ role: 'mentor', content: result }]);
        setAnswerInput('');
      } catch (error) {
        console.error('Error generating question:', error);
      } finally {
        setLoadingQuestionGeneration(false);
      }
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (answerInput()) {
      setLoading(true);

      // Add student's answer to conversation
      setConversation([...conversation(), { role: 'student', content: answerInput() }]);

      try {
        const conversationMessages = conversation()
          .map((msg) => `${msg.role === 'student' ? 'Student' : 'Mentor'}: ${msg.content}`)
          .join('\n');

        const result = await createEvent('chatgpt_request', {
          prompt: `You are helping a student learn. Continue the conversation to guide them to the correct answer without giving away the answer directly. Use encouragement and ask probing questions to help them think critically.

Conversation so far:
${conversationMessages}

Respond as the mentor in first person.`,
          response_type: 'text',
        });

        // Add mentor's feedback to conversation
        setConversation([...conversation(), { role: 'mentor', content: result }]);

        // Clear the student's answer input
        setAnswerInput('');
      } catch (error) {
        console.error('Error checking answer:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Scroll to bottom when conversation updates
  createEffect(
    on(
      () => conversation().length,
      () => {
        if (conversationContainer) {
          conversationContainer.scrollTop = conversationContainer.scrollHeight;
        }
      },
      { defer: true }
    )
  );

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={user()}
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
          <Show when={!question()}>
            <div class="space-y-4">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Do you want us to generate a question for you?</h2>
              <div class="flex space-x-4">
                <button
                  type="button"
                  class={`flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                    wantsGeneratedQuestion() === true ? 'ring-2 ring-green-400' : ''
                  }`}
                  onClick={() => setWantsGeneratedQuestion(true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                    wantsGeneratedQuestion() === false ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setWantsGeneratedQuestion(false)}
                >
                  No
                </button>
              </div>
              <Show when={wantsGeneratedQuestion() === true}>
                <form onSubmit={handleGenerateQuestion} class="space-y-4 mt-4">
                  <input
                    type="text"
                    placeholder="Year (e.g., 10)"
                    value={year()}
                    onInput={(e) => setYear(e.target.value)}
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Subject (e.g., Geography)"
                    value={subject()}
                    onInput={(e) => setSubject(e.target.value)}
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    required
                  />
                  <button
                    type="submit"
                    class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                      loadingQuestionGeneration() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={loadingQuestionGeneration()}
                  >
                    <Show when={loadingQuestionGeneration()} fallback="Generate Question">
                      Generating...
                    </Show>
                  </button>
                </form>
              </Show>
              <Show when={wantsGeneratedQuestion() === false}>
                <form onSubmit={handleSubmitQuestion} class="space-y-4 mt-4">
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
            </div>
          </Show>
          <Show when={question()}>
            <div class="space-y-4">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Conversation</h2>
              <div
                ref={el => (conversationContainer = el)}
                class="bg-white p-4 rounded-lg shadow-md max-h-[50vh] overflow-y-auto"
              >
                <For each={conversation()}>
                  {(msg) => (
                    <div class={`mb-4 ${msg.role === 'mentor' ? 'text-left' : 'text-right'}`}>
                      <div
                        class={`inline-block p-4 rounded-lg ${
                          msg.role === 'mentor' ? 'bg-purple-200' : 'bg-blue-200'
                        }`}
                      >
                        <SolidMarkdown>{msg.content}</SolidMarkdown>
                      </div>
                    </div>
                  )}
                </For>
              </div>
              <form onSubmit={handleSubmitAnswer} class="space-y-4">
                <textarea
                  placeholder="Type your response here..."
                  value={answerInput()}
                  onInput={(e) => setAnswerInput(e.target.value)}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
                <button
                  type="submit"
                  class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                    loading() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading()}
                >
                  <Show when={loading()} fallback="Submit">
                    Sending...
                  </Show>
                </button>
              </form>
              <button
                class="mt-4 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={() => {
                  resetState();
                }}
              >
                New Question
              </button>
            </div>
          </Show>
          <p class="mt-8 text-center text-gray-600">
            Made on{' '}
            <a
              href="https://www.zapt.ai"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:underline"
            >
              ZAPT
            </a>
          </p>
        </div>
      </Show>
    </div>
  );
}

export default App;