import { createSignal, createEffect, on, For, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { SolidMarkdown } from 'solid-markdown';

function Conversation(props) {
  const { question, setQuestion } = props;
  const [conversation, setConversation] = createSignal([{ role: 'mentor', content: question() }]);
  const [answerInput, setAnswerInput] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  let conversationContainer;

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

  const handleNewQuestion = () => {
    setQuestion('');
  };

  return (
    <div class="space-y-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 text-center">Conversation</h2>
      <div
        ref={(el) => (conversationContainer = el)}
        class="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-[50vh] overflow-y-auto"
      >
        <For each={conversation()}>
          {(msg) => (
            <div class={`flex mb-4 ${msg.role === 'mentor' ? 'justify-start' : 'justify-end'}`}>
              <div
                class={`relative max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  msg.role === 'mentor'
                    ? 'bg-indigo-100 text-gray-800'
                    : 'bg-green-100 text-gray-800'
                }`}
              >
                <SolidMarkdown>{msg.content}</SolidMarkdown>
                <span
                  class={`absolute top-0 ${
                    msg.role === 'mentor' ? '-left-2' : '-right-2'
                  } w-4 h-4 ${
                    msg.role === 'mentor' ? 'bg-indigo-100' : 'bg-green-100'
                  } transform rotate-45`}
                ></span>
              </div>
            </div>
          )}
        </For>
      </div>
      <form onSubmit={handleSubmitAnswer} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Your Response</label>
          <textarea
            placeholder="Type your response here..."
            value={answerInput()}
            onInput={(e) => setAnswerInput(e.target.value)}
            class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 box-border"
            required
          />
        </div>
        <button
          type="submit"
          class={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out cursor-pointer ${
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
        class="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out cursor-pointer"
        onClick={handleNewQuestion}
      >
        New Question
      </button>
    </div>
  );
}

export default Conversation;