import SkillVerification from '../models/SkillVerification.js';
import User from '../models/User.js';
import { quizData } from '../utils/quizData.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get timed quiz questions (excludes correctIndex answers)
 * @route   GET /api/skills/quiz/:skill
 * @access  Private (Freelancer)
 */
export const getQuiz = asyncHandler(async (req, res) => {
  const { skill } = req.params;
  const questions = quizData[skill];

  if (!questions) {
    throw ApiError.notFound(`No quiz found for skill: ${skill}`);
  }

  // Remove correctIndex to prevent cheating via inspect element
  const sanitizedQuestions = questions.map(({ id, question, options }) => ({
    id,
    question,
    options,
  }));

  res.json({
    success: true,
    skill,
    questions: sanitizedQuestions,
  });
});

/**
 * @desc    Evaluate quiz answers and verify skill
 * @route   POST /api/skills/verify/:skill
 * @access  Private (Freelancer)
 */
export const submitQuiz = asyncHandler(async (req, res) => {
  const { skill } = req.params;
  const { answers } = req.body; // Map: questionId -> chosenIndex (e.g. {1: 2, 2: 0})

  const questions = quizData[skill];
  if (!questions) {
    throw ApiError.notFound(`No quiz found for skill: ${skill}`);
  }

  if (!answers || typeof answers !== 'object') {
    throw ApiError.badRequest('Answers payload is required');
  }

  // Calculate score
  let correctCount = 0;
  questions.forEach((q) => {
    const chosen = answers[q.id];
    if (chosen !== undefined && Number(chosen) === q.correctIndex) {
      correctCount++;
    }
  });

  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  const isVerified = scorePercentage >= 70; // 70% threshold for verification

  // Update or insert verification document
  const verification = await SkillVerification.findOneAndUpdate(
    { userId: req.user._id, skill },
    {
      score: scorePercentage,
      verified: isVerified,
      attemptDate: new Date(),
    },
    { new: true, upsert: true }
  );

  // If verified, make sure it is reflected in user profile. Wait, users have `skills` array.
  // We can push it if not present, but wait, the prompt says "Freelancer profile should show Verified Skills: React ✔, Node ✔"
  // Having a verified skills list from SkillVerification query is extremely clean and reliable.
  
  res.json({
    success: true,
    score: scorePercentage,
    verified: isVerified,
    verification,
  });
});

/**
 * @desc    Get user's verified skills
 * @route   GET /api/skills/verifications
 * @access  Private
 */
export const getVerifications = asyncHandler(async (req, res) => {
  const verifications = await SkillVerification.find({
    userId: req.user._id,
    verified: true,
  });

  res.json({
    success: true,
    verifications,
  });
});
