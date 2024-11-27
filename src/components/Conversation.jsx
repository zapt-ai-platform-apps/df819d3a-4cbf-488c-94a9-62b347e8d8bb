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

      // Clear the student's answer input immediately
      setAnswerInput('');

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
    <div class="flex flex-col h-full max-w-2xl mx-auto">
      <div class="flex-1 overflow-y-auto p-4" ref={(el) => (conversationContainer = el)}>
        <For each={conversation()}>
          {(msg) => (
            <div class={`flex mb-4 ${msg.role === 'mentor' ? 'justify-start' : 'justify-end'}`}>
              <div class="flex items-end max-w-full">
                <div
                  class={`relative px-4 py-2 rounded-lg ${
                    msg.role === 'mentor'
                      ? 'bg-blue-100 text-gray-800'
                      : 'bg-green-100 text-gray-800'
                  } max-w-xs md:max-w-md lg:max-w-md`}
                >
                  <SolidMarkdown>{msg.content}</SolidMarkdown>
                  <span
                    class={`absolute top-0 ${
                      msg.role === 'mentor' ? '-left-2' : '-right-2'
                    } w-4 h-4 ${
                      msg.role === 'mentor' ? 'bg-blue-100' : 'bg-green-100'
                    } transform rotate-45`}
                  ></span>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
      <Show
        when={!loading()}
        fallback={
          <div class="text-center text-gray-700 py-4">
            <p>Awaiting response...</p>
          </div>
        }
      >
        <form onSubmit={handleSubmitAnswer} class="p-4 bg-white border-t border-gray-300">
          <div class="flex flex-col md:flex-row items-center">
            <textarea
              placeholder="Type your response..."
              value={answerInput()}
              onInput={(e) => setAnswerInput(e.target.value)}
              rows="8"
              class="flex-1 w-full resize-none p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-800"
              required
            />
            <button
              type="submit"
              class="mt-4 md:mt-0 md:ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out cursor-pointer"
            >
              Send
            </button>
          </div>
        </form>
      </Show>
      <button
        class="m-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out cursor-pointer"
        onClick={handleNewQuestion}
      >
        New Question
      </button>
    </div>
  );
}

export default Conversation;