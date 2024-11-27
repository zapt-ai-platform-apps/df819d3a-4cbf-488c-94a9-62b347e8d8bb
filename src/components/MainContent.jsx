import { createSignal } from 'solid-js';
import QuestionOption from './QuestionOption';
import QuestionForm from './QuestionForm';
import Conversation from './Conversation';

function MainContent() {
  const [question, setQuestion] = createSignal('');
  const [wantsGeneratedQuestion, setWantsGeneratedQuestion] = createSignal(null);

  return (
    <main class="flex items-center justify-center h-full">
      <div class="max-w-4xl w-full bg-white text-gray-800 rounded-lg shadow-md p-8 mx-4">
        <Show when={question()} fallback={
          <>
            <QuestionOption setWantsGeneratedQuestion={setWantsGeneratedQuestion} />
            <Show when={wantsGeneratedQuestion() !== null}>
              <QuestionForm
                wantsGeneratedQuestion={wantsGeneratedQuestion}
                setQuestion={setQuestion}
              />
            </Show>
          </>
        }>
          <Conversation question={question} setQuestion={setQuestion} />
        </Show>
      </div>
    </main>
  );
}

export default MainContent;