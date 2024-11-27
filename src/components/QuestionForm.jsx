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
    <div class="mt-4">
      <Show when={wantsGeneratedQuestion()}>
        <form onSubmit={handleGenerateQuestion} class="space-y-4">
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
              loading() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            <Show when={loading()} fallback="Generate Question">
              Generating...
            </Show>
          </button>
        </form>
      </Show>
      <Show when={!wantsGeneratedQuestion()}>
        <form onSubmit={handleSubmitQuestion} class="space-y-4">
          <textarea
            placeholder="Type your question here..."
            value={customQuestion()}
            onInput={(e) => setCustomQuestion(e.target.value)}
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
  );
}

export default QuestionForm;