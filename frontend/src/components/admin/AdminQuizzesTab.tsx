import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, CheckCircle2, XCircle, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';
import { AdminQuizDetail, AdminQuizQuestionItem } from '../../types';
import { createAdminQuestion, deleteAdminQuestion } from '../../services/api';

interface Props {
  token: string;
  quizzes: AdminQuizDetail[];
  onRefresh: () => void;
}

export const AdminQuizzesTab: React.FC<Props> = ({ token, quizzes, onRefresh }) => {
  const [selectedQuizId, setSelectedQuizId] = useState<number>(quizzes[0]?.id || 1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    explanation: '',
    source_id: undefined as number | undefined,
    order_index: 0,
    options: [
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false }
    ]
  });

  const currentQuiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes[0];

  const handleOptionChange = (index: number, text: string) => {
    const updated = [...newQuestion.options];
    updated[index].option_text = text;
    setNewQuestion({ ...newQuestion, options: updated });
  };

  const handleSetCorrect = (index: number) => {
    const updated = newQuestion.options.map((opt, i) => ({
      ...opt,
      is_correct: i === index
    }));
    setNewQuestion({ ...newQuestion, options: updated });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuiz) return;
    const validOptions = newQuestion.options.filter((o) => o.option_text.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options.');
      return;
    }
    if (!validOptions.some((o) => o.is_correct)) {
      alert('Please mark at least one option as the correct answer.');
      return;
    }

    setSubmitting(true);
    try {
      await createAdminQuestion(token, currentQuiz.id, {
        question_text: newQuestion.question_text.trim(),
        explanation: newQuestion.explanation.trim(),
        source_id: newQuestion.source_id,
        order_index: currentQuiz.questions.length + 1,
        options: validOptions
      });
      setShowAddModal(false);
      setNewQuestion({
        question_text: '',
        explanation: '',
        source_id: undefined,
        order_index: 0,
        options: [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false }
        ]
      });
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to create question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (questionId: number) => {
    if (!window.confirm(`Are you sure you want to delete question #${questionId}?`)) return;
    try {
      await deleteAdminQuestion(token, questionId);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E6D5C3] shadow-sm p-6 space-y-6">
      {/* Header & Tradition selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412] flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Curatorial Knowledge Assessment
          </span>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            Heritage Quizzes & Question Management
          </h2>
          <p className="text-xs text-slate-500">
            Manage institutional quiz questions, multiple choice options, and archival citations across traditions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Refresh quizzes"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tradition Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {quizzes.map((q) => (
          <button
            key={q.id}
            onClick={() => setSelectedQuizId(q.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedQuizId === q.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{q.tradition_name}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
              {q.questions.length} Questions
            </span>
          </button>
        ))}
      </div>

      {/* Current Quiz Overview */}
      {currentQuiz && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">{currentQuiz.title}</h3>
              <p className="text-xs text-slate-600">{currentQuiz.description}</p>
            </div>
            <a
              href={`/quizzes`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors shadow-2xs"
            >
              <span>Test Public Quiz</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#9A3412]" />
            </a>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {currentQuiz.questions.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                No questions yet in this quiz. Click "Add Question" above.
              </div>
            ) : (
              currentQuiz.questions.map((qn, idx) => (
                <div
                  key={qn.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-[#9A3412]/40 transition-all space-y-3 bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#9A3412] uppercase tracking-wider">
                        Question #{idx + 1}
                      </span>
                      <h4 className="font-serif font-bold text-slate-900 text-sm">{qn.question_text}</h4>
                    </div>

                    <button
                      onClick={() => handleDelete(qn.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {qn.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          opt.is_correct
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {opt.is_correct ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                        )}
                        <span>{opt.option_text}</span>
                        {opt.is_correct && (
                          <span className="ml-auto text-[10px] font-bold uppercase text-emerald-700">Correct</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-700 block text-[11px]">Curatorial Explanation:</span>
                    <p className="italic">{qn.explanation}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#E6D5C3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-[#7C2D12] to-[#9A3412] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
                  {currentQuiz?.tradition_name}
                </span>
                <h3 className="font-serif font-bold text-lg">Add Quiz Question</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Question Text</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. What alloy proportions are traditionally utilized by the Thathera craftspeople?"
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9A3412]"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  Options (select radio for correct answer)
                </label>
                {newQuestion.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_option"
                      checked={opt.is_correct}
                      onChange={() => handleSetCorrect(i)}
                      className="w-4 h-4 text-[#9A3412] focus:ring-[#9A3412]"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt.option_text}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs"
                      required={i < 2}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Archival Explanation</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain why the answer is correct based on primary institutional sources (UNESCO, GI, SNA)..."
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#9A3412]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-white bg-[#9A3412] hover:bg-[#7C2D12] font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving Question...' : 'Add to Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
