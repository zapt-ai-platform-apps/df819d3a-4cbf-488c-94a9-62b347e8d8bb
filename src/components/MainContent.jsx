import { createSignal } from 'solid-js';
import QuestionOption from './QuestionOption';
import QuestionForm from './QuestionForm';
import Conversation from './Conversation';

function MainContent() {
  const [question, setQuestion] = createSignal('');
  const [wantsGeneratedQuestion, setWantsGeneratedQuestion] = createSignal(null);

  return (
    <main class="flex items-center justify-center min-h-screen">
      <div class="max-w-4xl w-full bg-white text-gray-800 rounded-lg shadow-md p-8 mx-4">
        {question() ? (
          <Conversation question={question} setQuestion={setQuestion} />
        ) : (
          <>
            <QuestionOption setWantsGeneratedQuestion={setWantsGeneratedQuestion} />
            {wantsGeneratedQuestion() !== null && (
              <QuestionForm
                wantsGeneratedQuestion={wantsGeneratedQuestion}
                setQuestion={setQuestion}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default MainContent;