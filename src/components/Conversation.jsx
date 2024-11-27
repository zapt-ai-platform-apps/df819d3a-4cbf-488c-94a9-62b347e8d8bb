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
    <div class="space-y-4">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Conversation</h2>
      <div
        ref={(el) => (conversationContainer = el)}
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
        onClick={handleNewQuestion}
      >
        New Question
      </button>
    </div>
  );
}

export default Conversation;