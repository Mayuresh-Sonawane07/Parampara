import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, ArrowLeft, RotateCcw, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import { fetchTradition, fetchQuiz, submitQuiz } from '../services/api';
import { TraditionDetail, Quiz, QuizSubmitResponse } from '../types';
import { SourceBadge } from '../components/SourceBadge';

export const QuizPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tradition, setTradition] = useState<TraditionDetail | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [userSelections, setUserSelections] = useState<{ [questionId: number]: number }>({});
  const [quizResult, setQuizResult] = useState<QuizSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    Promise.all([fetchTradition(slug), fetchQuiz(slug)])
      .then(([tData, qData]) => {
        setTradition(tData);
        setQuiz(qData);
      })
      .catch((err) => setError(err.message || 'Quiz not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSelectOption = (questionId: number, optionId: number) => {
    if (quizResult) return; // Locked once submitted
    setUserSelections((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const answeredCount = Object.keys(userSelections).length;
    if (answeredCount < quiz.questions.length) {
      alert(`Please answer all ${quiz.questions.length} questions before submitting.`);
      return;
    }

    setSubmitting(true);
    try {
      const answersPayload = Object.entries(userSelections).map(([qid, oid]) => ({
        question_id: Number(qid),
        option_id: oid,
      }));
      const res = await submitQuiz(quiz.id, answersPayload);
      setQuizResult(res);
    } catch (err: any) {
      alert(err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setUserSelections({});
    setQuizResult(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Loading verified quiz questions...
        </p>
      </div>
    );
  }

  if (error || !tradition || !quiz) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-cinzel text-2xl font-bold text-slate-900">Quiz Unavailable</h2>
        <p className="text-slate-600">{error || 'No verified quiz currently configured for this tradition.'}</p>
        <Link to="/explore" className="inline-block px-6 py-3 rounded-xl bg-[#9A3412] text-white font-bold text-sm shadow-md">
          Return to Explore
        </Link>
      </div>
    );
  }

  const answeredCount = Object.keys(userSelections).length;
  const progressPercent = Math.round((answeredCount / quiz.questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 font-sans">
        <Link
          to={`/tradition/${tradition.slug}`}
          className="flex items-center gap-1.5 hover:text-[#9A3412] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {tradition.name} Dossier
        </Link>
        <span>{tradition.region} India • {tradition.state}</span>
      </div>

      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#7C2D12] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3 border border-amber-500/20">
        <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-cinzel">
          <Award className="w-4 h-4" />
          Heritage Knowledge Verification
        </div>
        <h1 className="font-cinzel text-2xl sm:text-4xl font-black tracking-tight">
          {quiz.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans max-w-2xl">
          {quiz.description || 'Answer each question below. All questions and explanations are grounded in authentic UNESCO and GI primary archival sources.'}
        </p>

        {/* Progress bar */}
        {!quizResult && (
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-amber-200 font-bold font-sans">
              <span>Progress: {answeredCount} of {quiz.questions.length} Answered</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Final Score Banner if submitted */}
      {quizResult && (
        <div className="glass-card rounded-3xl border-2 border-amber-400 p-8 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block font-cinzel">
            Your Heritage Assessment Score
          </span>
          <div className="text-4xl sm:text-6xl font-black font-cinzel text-[#9A3412]">
            {quizResult.correct_answers} / {quizResult.total_questions}
          </div>
          <p className="text-sm font-bold text-slate-800">
            Score: {quizResult.score_percentage}%
          </p>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-sans">
            {quizResult.score_percentage === 100
              ? 'Outstanding! You have thoroughly understood the living cultural essence of this tradition.'
              : 'Good effort! Review the detailed institutional explanations and citations below to deepen your cultural understanding.'}
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
            </button>
            <Link
              to="/explore"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-md transition-colors"
            >
              Explore Next Tradition <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {quiz.questions.map((q, idx) => {
          const selectedOptionId = userSelections[q.id];
          const resultDetail = quizResult?.results.find((r) => r.question_id === q.id);

          return (
            <div
              key={q.id}
              className="bg-white rounded-3xl border border-[#E6D5C3] p-6 sm:p-7 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-cinzel">
                  Question {idx + 1} of {quiz.questions.length}
                </span>

                {resultDetail && (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      resultDetail.is_correct
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}
                  >
                    {resultDetail.is_correct ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              <h3 className="font-cinzel font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                {q.question_text}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-1">
                {q.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optionStyle = 'bg-slate-50 hover:bg-orange-50 text-slate-800 border-slate-200';

                  if (quizResult && resultDetail) {
                    if (opt.id === resultDetail.correct_option_id) {
                      optionStyle = 'bg-emerald-50 text-emerald-950 border-emerald-500 font-bold shadow-xs';
                    } else if (isSelected && !resultDetail.is_correct) {
                      optionStyle = 'bg-rose-50 text-rose-950 border-rose-400 line-through';
                    } else {
                      optionStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-[#9A3412] text-white border-[#7C2D12] shadow-md font-bold';
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={!!quizResult}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                    >
                      <span className="font-sans">{opt.option_text}</span>
                      {isSelected && !quizResult && (
                        <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-md bg-white/25">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Verified Explanation & Source display upon quiz completion */}
              {resultDetail && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="bg-amber-50/90 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1.5 font-sans">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900 font-cinzel">
                      <BookOpen className="w-3.5 h-3.5" />
                      Verified Archival Citation & Explanation:
                    </span>
                    <p className="leading-relaxed">{resultDetail.explanation}</p>
                  </div>

                  {resultDetail.source && (
                    <div className="pt-1">
                      <SourceBadge source={resultDetail.source} compact />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!quizResult && (
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-4 rounded-2xl text-sm font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-xl shadow-orange-950/20 disabled:opacity-50 transition-all hover:scale-102 cursor-pointer"
          >
            {submitting ? 'Evaluating...' : 'Submit Answers for Verification'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
