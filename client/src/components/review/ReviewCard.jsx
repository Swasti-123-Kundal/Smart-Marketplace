import React from 'react';
import { Star } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/formatters';

const ReviewCard = ({ review }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={review.clientId?.profileImage}
            name={review.clientId?.name}
            size="sm"
          />
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-50">
              {review.clientId?.name || 'Enterprise Partner'}
            </h4>
            <span className="text-[10px] text-slate-400 font-semibold block">
              Reviewed {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5">
          {stars.map((star) => (
            <Star
              key={star}
              size={12}
              className={`${
                star <= review.rating
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-slate-200 dark:text-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
        {review.comment}
      </p>
    </Card>
  );
};

export default ReviewCard;
