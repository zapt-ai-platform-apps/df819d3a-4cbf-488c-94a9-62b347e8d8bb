import { createSignal } from 'solid-js';
import QuestionOption from './QuestionOption';
import QuestionForm from './QuestionForm';
import Conversation from './Conversation';

function MainContent() {
  const [question, setQuestion] = createSignal('');
  const [wantsGeneratedQuestion, setWantsGeneratedQuestion] = createSignal(null);

  return (
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </main>
  );
}

export default MainContent;