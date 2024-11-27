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
    <div class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto p-4" ref={(el) => (conversationContainer = el)}>
        <For each={conversation()}>
          {(msg) => (
            <div class={`flex mb-4 ${msg.role === 'mentor' ? 'justify-start' : 'justify-end'}`}>
              <div class="flex items-end max-w-full">
                <Show when={msg.role === 'mentor'}>
                  <div class="hidden sm:block w-8 h-8 mr-2">
                    <img src="https://images.unsplash.com/photo-1637173282320-92462b116d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw1fHxtZW50b3IlMjBhdmF0YXJ8ZW58MHx8fHwxNzMyNzMwOTg4fDA&ixlib=rb-4.0.3&q=80&w=1080"
                      
                      alt="Mentor Avatar"
                      class="w-8 h-8 rounded-full"
                      data-image-request="mentor avatar"
                    />
                  </div>
                </Show>
                <div
                  class={`relative px-4 py-2 rounded-lg ${
                    msg.role === 'mentor'
                      ? 'bg-blue-100 text-gray-800'
                      : 'bg-green-100 text-gray-800'
                  } max-w-xs md:max-w-md lg:max-w-lg`}
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
                <Show when={msg.role === 'student'}>
                  <div class="hidden sm:block w-8 h-8 ml-2">
                    <img src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwzfHxzdHVkZW50JTIwYXZhdGFyfGVufDB8fHx8MTczMjczMDk4OHww&ixlib=rb-4.0.3&q=80&w=1080"
                      
                      alt="Student Avatar"
                      class="w-8 h-8 rounded-full"
                      data-image-request="student avatar"
                    />
                  </div>
                </Show>
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
          <div class="flex items-center">
            <textarea
              placeholder="Type your response..."
              value={answerInput()}
              onInput={(e) => setAnswerInput(e.target.value)}
              rows="1"
              class="flex-1 resize-none p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-800"
              required
            />
            <button
              type="submit"
              class="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out cursor-pointer"
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