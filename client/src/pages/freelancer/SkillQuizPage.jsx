import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuiz, submitQuizAnswers, clearQuiz } from '../../redux/slices/skillSlice';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Clock, CheckCircle2, XCircle, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

const SkillQuizPage = () => {
  const { skill } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, loading, error } = useSelector((state) => state.skills);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [quizFinished, setQuizFinished] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    dispatch(fetchQuiz(skill));
    return () => {
      dispatch(clearQuiz());
    };
  }, [dispatch, skill]);

  // Timer Effect
  useEffect(() => {
    if (quizFinished || timeLeft <= 0 || !currentQuiz) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizFinished, currentQuiz]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && !quizFinished && currentQuiz) {
      handleQuizSubmit();
    }
  }, [timeLeft, quizFinished, currentQuiz]);

  const handleSelectOption = (qId, optionIdx) => {
    setAnswers({
      ...answers,
      [qId]: optionIdx,
    });
  };

  const handleQuizSubmit = async () => {
    setQuizFinished(true);
    try {
      const res = await dispatch(submitQuizAnswers({ skill, answers })).unwrap();
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading && !quizFinished) return <Loader />;
  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <p className="text-red-500 font-bold">{error}</p>
        <Link to="/freelancer/profile">
          <Button variant="outline">Back to Profile</Button>
        </Link>
      </div>
    );
  }

  if (!currentQuiz) return null;

  // Render Result Page
  if (quizFinished) {
    if (!result) return <Loader />;
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-6">
        <Card className="flex flex-col items-center p-8 gap-5">
          {result.verified ? (
            <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-full animate-bounce">
              <CheckCircle2 size={48} />
            </div>
          ) : (
            <div className="p-4 bg-red-500/10 text-red-600 rounded-full">
              <XCircle size={48} />
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {skill} Verification Results
            </h1>
            <p className="text-4xl font-black mt-2 text-primary-600">{result.score}%</p>
          </div>

          <Badge variant={result.verified ? 'success' : 'danger'} className="px-4 py-1 text-sm font-extrabold uppercase">
            {result.verified ? 'Verified ✔' : 'Failed'}
          </Badge>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            {result.verified
              ? `Congratulations! You scored ${result.score}% and earned your verified badge. This skill is now displayed on your public profile.`
              : 'You need at least 70% to verify this skill. You can review the material and try again later.'}
          </p>

          <Link to="/freelancer/profile" className="w-full">
            <Button variant="primary" className="w-full py-3">
              Back to Profile
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const activeQuestion = currentQuiz[currentIdx];
  const isLastQuestion = currentIdx === currentQuiz.length - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">{skill} Skill Verification</h1>
          <p className="text-xs text-slate-400">Question {currentIdx + 1} of {currentQuiz.length}</p>
        </div>

        {/* Timer Card */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-sm transition-all
          ${timeLeft < 60
            ? 'bg-red-500/10 border-red-500/20 text-red-600 animate-pulse'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-300'
          }
        `}>
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Quiz Card */}
      <Card className="p-6 md:p-8 flex flex-col gap-6">
        <h2 className="text-base md:text-lg font-bold text-slate-950 dark:text-slate-50 leading-relaxed">
          {activeQuestion.question}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {activeQuestion.options.map((opt, idx) => {
            const isSelected = answers[activeQuestion.id] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(activeQuestion.id, idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all
                  ${isSelected
                    ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border-primary-500/40 shadow-sm'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Actions Navigation */}
        <div className="flex justify-between mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/50">
          <Button
            variant="outline"
            onClick={() => setCurrentIdx(currentIdx - 1)}
            disabled={currentIdx === 0}
            icon={ArrowLeft}
          >
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              variant="accent"
              onClick={handleQuizSubmit}
              disabled={Object.keys(answers).length < currentQuiz.length}
            >
              Submit Test
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setCurrentIdx(currentIdx + 1)}
              icon={ArrowRight}
              iconPosition="right"
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SkillQuizPage;
