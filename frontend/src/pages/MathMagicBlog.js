import React from 'react';
import { Link } from 'react-router-dom';

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

export default function MathMagicBlog() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">MathMagic: Fast Math Tricks</h1>
        <p className="text-gray-600">No login required. Learn mental math shortcuts to save time.</p>
      </header>

      <div className="grid gap-6">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-lg border border-gray-200 p-5 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
            <p className="text-xs text-gray-500 mb-3">{new Date(post.date).toDateString()}</p>
            <p className="text-gray-700 mb-3">{post.excerpt}</p>
            <details>
              <summary className="cursor-pointer text-blue-600">Read more</summary>
              <div className="whitespace-pre-wrap mt-3 text-gray-800">{post.content}</div>
            </details>
          </article>
        ))}
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        <p>Want more? Request a topic on our issues page.</p>
        <p>
          <Link to="/">Back to Home</Link>
        </p>
      </footer>
    </div>
  );
}
