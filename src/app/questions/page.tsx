'use client';
import Error from '@/components/Error';
import Loader from '@/components/Loader';
import Question from '@/components/Question';
import Snackbar from '@/components/Snackbar';
import { ApiResponse, Results } from '@/types';
import { useState, useEffect } from 'react';

function Questions() {
  const [questions, setQuestions] = useState<Results[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);

  const getQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=5');
      const data: ApiResponse = await response.json();
      if (!response.ok) {
        setError(true);
      }
      setQuestions(data.results);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const closeSnackbar = () => {
    setShowMessage(false);

    setTimeout(() => {
      setChecking(false);
    }, 300);
  };

  const checkAnswers = () => {
    setChecking(true);

    setTimeout(() => {
      if (answeredQuestions !== questions.length) {
        setShowMessage(true);
        return;
      }

      setAnsweredQuestions(0);
      setShowResults((prevState) => !prevState);
    }, 100);
  };

  const restart = () => {
    setCorrectAnswers(0);
    setShowResults((prevState) => !prevState);

    getQuestions();
  };

  return (
    <>
      <section className='grid gap-10 max-w-screen-md px-5 py-10 md:py-14 mx-auto min-h-screen'>
        {loading ? (
          <Loader />
        ) : !loading && error ? (
          <Error onClick={() => getQuestions()} />
        ) : (
          <ul className='flex flex-col gap-4'>
            {questions?.map((question, index) => (
              <Question
                key={index}
                question={question.question}
                options={question.incorrect_answers}
                answer={question.correct_answer}
                showResults={showResults}
                setCorrectAnswers={setCorrectAnswers}
                answeredQuestions={answeredQuestions}
                setAnsweredQuestions={setAnsweredQuestions}
              />
            ))}
          </ul>
        )}
        {!showResults && !loading && !error && (
          <div className='flex gap-4 items-center justify-self-center'>
            <button
              type='button'
              onClick={checkAnswers}
              className='font-semibold place-self-center text-center text-light py-3 px-8 bg-lightBlue rounded-xl border-[3px] hover:text-darkBlue hover:bg-transparent border-lightBlue focus-visible:outline-2 focus-visible:bg-transparent focus-visible:outline-accent focus-visible:text-darkBlue transition'
            >
              Check answers
            </button>
          </div>
        )}
        {showResults && (
          <div className='flex flex-wrap gap-4 items-center justify-center'>
            <p className='text-darkBlue font-bold'>{`You got ${correctAnswers}/${questions.length} questions right`}</p>
            <button
              type='button'
              onClick={() => restart()}
              className='font-semibold place-self-center text-center text-light py-2 px-6 bg-lightBlue rounded-xl border-[3px] hover:text-darkBlue hover:bg-transparent border-lightBlue focus-visible:outline-2 focus-visible:bg-transparent focus-visible:outline-accent focus-visible:text-darkBlue transition'
            >
              Play again
            </button>
          </div>
        )}
      </section>
      {checking && (
        <Snackbar
          message={`Answer all questions: ${
            questions.length - answeredQuestions
          } question${answeredQuestions < 4 ? 's' : ''} left`}
          close={closeSnackbar}
          show={showMessage}
        />
      )}
    </>
  );
}

export default Questions;
