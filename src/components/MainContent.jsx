import { createSignal, Show } from 'solid-js';
import QuestionOption from './QuestionOption';
import QuestionForm from './QuestionForm';
import Conversation from './Conversation';

function MainContent() {
  const [question, setQuestion] = createSignal('');
  const [wantsGeneratedQuestion, setWantsGeneratedQuestion] = createSignal(null);

  return (
    <main class="flex-1 flex flex-col">
      <Show
        when={question()}
        fallback={
          <div class="flex flex-1 items-center justify-center">
            <div class="max-w-4xl w-full bg-white text-gray-800 rounded-lg shadow-md p-8 mx-4">
              <QuestionOption setWantsGeneratedQuestion={setWantsGeneratedQuestion} />
              <Show when={wantsGeneratedQuestion() !== null}>
                <QuestionForm
                  wantsGeneratedQuestion={wantsGeneratedQuestion}
                  setQuestion={setQuestion}
                />
              </Show>
            </div>
          </div>
        }
      >
        <div class="flex-1">
          <Conversation question={question} setQuestion={setQuestion} />
        </div>
      </Show>
    </main>
  );
}

export default MainContent;