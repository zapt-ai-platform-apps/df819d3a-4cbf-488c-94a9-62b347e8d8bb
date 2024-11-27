import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';

function QuestionForm(props) {
  const { wantsGeneratedQuestion, setQuestion } = props;
  const [loading, setLoading] = createSignal(false);
  const [year, setYear] = createSignal('');
  const [subject, setSubject] = createSignal('');
  const [customQuestion, setCustomQuestion] = createSignal('');

  const handleGenerateQuestion = async (e) => {
    e.preventDefault();
    if (year() && subject()) {
      setLoading(true);
      try {
        const result = await createEvent('chatgpt_request', {
          prompt: `Generate a GCSE level question for a UK student in year ${year()} on the subject of ${subject()}. Include any necessary information, and provide the total marks for the question. Do not include the answer or solution. Format the question appropriately.`,
          response_type: 'text',
        });
        setQuestion(result);
      } catch (error) {
        console.error('Error generating question:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (customQuestion()) {
      setQuestion(customQuestion());
    }
  };

  return (
    <div class="mt-8">
      <Show when={wantsGeneratedQuestion()}>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleGenerateQuestion} class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="text"
                placeholder="e.g., 10"
                value={year()}
                onInput={(e) => setYear(e.target.value)}
                class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 box-border"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                placeholder="e.g., Geography"
                value={subject()}
                onInput={(e) => setSubject(e.target.value)}
                class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 box-border"
                required
              />
            </div>
            <button
              type="submit"
              class={`w-full px-6 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                loading() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading()}
            >
              <Show when={loading()} fallback="Generate Question">
                Generating...
              </Show>
            </button>
          </form>
        </div>
      </Show>
      <Show when={!wantsGeneratedQuestion()}>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmitQuestion} class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Your Question</label>
              <textarea
                placeholder="Type your question here..."
                value={customQuestion()}
                onInput={(e) => setCustomQuestion(e.target.value)}
                class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 box-border"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full px-6 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              Submit Question
            </button>
          </form>
        </div>
      </Show>
    </div>
  );
}

export default QuestionForm;