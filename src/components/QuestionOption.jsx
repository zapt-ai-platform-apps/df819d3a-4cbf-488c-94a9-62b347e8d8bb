function QuestionOption(props) {
  const { setWantsGeneratedQuestion } = props;

  return (
    <div class="space-y-4">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Do you want us to generate a question for you?</h2>
      <div class="flex space-x-4">
        <button
          type="button"
          class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={() => setWantsGeneratedQuestion(true)}
        >
          Yes
        </button>
        <button
          type="button"
          class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={() => setWantsGeneratedQuestion(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default QuestionOption;