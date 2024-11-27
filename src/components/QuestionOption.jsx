function QuestionOption(props) {
  const { setWantsGeneratedQuestion } = props;

  return (
    <div class="space-y-6">
      <h2 class="text-3xl font-bold mb-4 text-gray-900 text-center">Would you like us to generate a question for you?</h2>
      <div class="flex justify-center space-x-6">
        <button
          type="button"
          class="flex-1 max-w-xs px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={() => setWantsGeneratedQuestion(true)}
        >
          Yes
        </button>
        <button
          type="button"
          class="flex-1 max-w-xs px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={() => setWantsGeneratedQuestion(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default QuestionOption;