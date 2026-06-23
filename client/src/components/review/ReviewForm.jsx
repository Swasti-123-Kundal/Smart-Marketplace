import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import reviewService from '../../services/reviewService';

const ReviewForm = ({ contractId, freelancerId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      await reviewService.createReview({
        freelancerId,
        contractId,
        rating,
        comment,
      });
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">Leave Feedback Rating</h3>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-semibold rounded-xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Select */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Your Rating</span>
          <div className="flex items-center gap-1 mt-1">
            {stars.map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform active:scale-95"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <Star
                  size={24}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-slate-200 dark:text-slate-800'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Written Feedback</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about the quality of work, speed, communication..."
            rows={4}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          className="w-full"
        >
          Submit Feedback
        </Button>
      </form>
    </Card>
  );
};

export default ReviewForm;
