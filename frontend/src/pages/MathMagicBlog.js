import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const posts = [
  {
    slug: 'vedic-multiplication-trick',
    title: 'Vedic Multiplication: Urdhva-Tiryagbhyam (Vertically and Crosswise)',
    date: '2025-10-26',
    excerpt: 'Multiply large numbers mentally using the vertical and crosswise method with examples.',
    content: `
The Urdhva-Tiryagbhyam method lets you multiply any two numbers quickly.
Example: 43 × 27
- Units: 3×7 = 21 → write 1, carry 2
- Cross: (4×7 + 3×2) = 28 + 6 = 34; add carry 2 → 36 → write 6, carry 3
- Tens: 4×2 = 8; add carry 3 → 11
Answer: 1161
Practice with 68×54 and 76×93.
    `,
  },
  {
    slug: 'multiplying-by-11',
    title: 'Multiply Any Two-Digit Number by 11 Instantly',
    date: '2025-10-26',
    excerpt: 'A mental math gem: insert the digit-sum between digits with carrying when needed.',
    content: `
For 52 × 11: Add digits 5 + 2 = 7 and place between → 572.
If sum ≥ 10, carry: 68 × 11 → write last digit 8; middle is 6+8=14 → write 4, carry 1 to first → 6+1=7 → 748.
    `,
  },
  {
    slug: 'divisibility-rules',
    title: 'Divisibility Rules You Must Know',
    date: '2025-10-26',
    excerpt: 'Quick checks for 2,3,4,5,6,8,9,10,11 to save time and avoid long division.',
    content: `
- 2: last digit even
- 3: sum of digits divisible by 3
- 4: last two digits divisible by 4
- 5: ends with 0 or 5
- 6: divisible by 2 and 3
- 8: last three digits divisible by 8
- 9: sum of digits divisible by 9
- 10: ends with 0
- 11: alternating sum of digits is 0 or multiple of 11
    `,
  },
  {
    slug: 'square-near-50',
    title: 'Squaring Numbers Near 50',
    date: '2025-10-26',
    excerpt: 'Use (50 + x)^2 = 2500 + 100x + x^2 for quick squaring.',
    content: `
Example: 53^2 → x=3 → 2500 + 300 + 9 = 2809.
Example: 47^2 → x=-3 → 2500 - 300 + 9 = 2209.
    `,
  },
  {
    slug: 'mental-multiplication-9s',
    title: 'Fast Multiplication by 9 and 99',
    date: '2025-10-26',
    excerpt: 'Use complements to 10/100 for blazing-fast multiplication by 9 or 99.',
    content: `
For 38 × 9: think 38×10 - 38 = 380 - 38 = 342.
For 74 × 99: 74×100 - 74 = 7400 - 74 = 7326.
    `,
  },
];

// Daily Math Challenge data
const mathChallenges = [
  {
    date: '2025-10-26',
    problem: 'What is 47^2?',
    answer: '2209',
    hint: 'Use the formula (50-3)^2 = 2500 - 300 + 9',
    difficulty: 'medium'
  },
  {
    date: '2025-10-27',
    problem: 'Calculate 68 × 11',
    answer: '748',
    hint: 'Remember: insert the sum of digits in the middle',
    difficulty: 'easy'
  },
  {
    date: '2025-10-28',
    problem: 'Is 5643 divisible by 9?',
    answer: 'yes',
    hint: 'Check if the sum of all digits is divisible by 9',
    difficulty: 'easy'
  },
  {
    date: '2025-10-29',
    problem: 'Solve: 86 × 9',
    answer: '774',
    hint: 'Think 86 × 10 - 86',
    difficulty: 'medium'
  },
  {
    date: '2025-10-30',
    problem: 'What is 53^2?',
    answer: '2809',
    hint: 'Use (50+3)^2 = 2500 + 300 + 9',
    difficulty: 'medium'
  },
];

function getDailyChallengeIndex() {
  const today = new Date();
  const startDate = new Date('2025-10-26');
  const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  return daysDiff % mathChallenges.length;
}

export default function MathMagicBlog() {
  const { user, token, API } = useContext(AuthContext);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [challengeSolved, setChallengeSolved] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState([]);

  useEffect(() => {
    const challengeIndex = getDailyChallengeIndex();
    setDailyChallenge(mathChallenges[challengeIndex]);

    // Load user's solved challenges if logged in
    if (user && token) {
      axios.get(`${API}/math-challenges/solved`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setSolvedChallenges(response.data.solved || []);
        const today = new Date().toISOString().split('T')[0];
        setChallengeSolved(response.data.solved?.includes(today) || false);
      })
      .catch(() => {
        // If endpoint doesn't exist yet, that's okay
      });
    }
  }, [user, token, API]);

  const handleSubmitAnswer = async () => {
    if (!dailyChallenge || !userAnswer.trim()) return;

    const isCorrect = userAnswer.trim().toLowerCase() === dailyChallenge.answer.toLowerCase();

    if (isCorrect) {
      toast.success('🎉 Correct! Great job!');
      setChallengeSolved(true);

      // Save solved status if user is logged in
      if (user && token) {
        const today = new Date().toISOString().split('T')[0];
        try {
          await axios.post(`${API}/math-challenges/solve`, {
            date: today,
            challengeId: getDailyChallengeIndex()
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSolvedChallenges(prev => [...prev, today]);
        } catch (error) {
          // If endpoint doesn't exist, that's okay - still mark as solved locally
        }
      }
    } else {
      toast.error('Not quite! Try again or check the hint.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">MathMagic: Fast Math Tricks</h1>
        <p className="text-gray-600 dark:text-gray-300">No login required. Learn mental math shortcuts to save time.</p>
      </header>

      {/* Daily Math Challenge Section */}
      {dailyChallenge && (
        <Card className="mb-8 border-blue-200 dark:border-blue-800 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Daily Math Challenge
            </CardTitle>
            <CardDescription className="flex items-center gap-2 dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              {new Date().toDateString()}
              {challengeSolved && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Solved!
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
              <p className="text-lg font-medium dark:text-white">{dailyChallenge.problem}</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {dailyChallenge.difficulty}
              </span>
            </div>

            {!challengeSolved ? (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                    placeholder="Your answer..."
                    className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button onClick={handleSubmitAnswer}>
                    Submit
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                  >
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </Button>
                  {showHint && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                      💡 {dailyChallenge.hint}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  ✅ You've completed today's challenge! Come back tomorrow for a new one.
                </p>
              </div>
            )}

            {user && solvedChallenges.length > 0 && (
              <div className="pt-4 border-t dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  🏆 You've solved <span className="font-bold text-blue-600 dark:text-blue-400">{solvedChallenges.length}</span> challenge(s)!
                </p>
              </div>
            )}

            {!user && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                <Link to="/login" className="text-blue-600 dark:text-blue-400 underline">Sign in</Link> to track your progress across days!
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Math Tricks Blog Posts */}
      <div className="grid gap-6">
        {posts.map((post) => (
          <article className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800 shadow-sm" key={post.slug}>
            <h2 className="text-xl font-semibold mb-1 dark:text-white">{post.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{new Date(post.date).toDateString()}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{post.excerpt}</p>
            <details>
              <summary className="cursor-pointer text-blue-600 dark:text-blue-400">Read more</summary>
              <div className="whitespace-pre-wrap mt-3 text-gray-800 dark:text-gray-200">{post.content}</div>
            </details>
          </article>
        ))}
      </div>

      <footer className="mt-10 text-sm text-gray-500 dark:text-gray-400">
        Want more? Request a topic on our issues page.
        <p>
          <Link to="/">Back to Home</Link>
        </p>
      </footer>
    </div>
  );
}
