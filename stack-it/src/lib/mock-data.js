export const questions = [
  {
    id: "1",
    title: "How to center a div in CSS?",
    excerpt:
      "I've been trying to center a div both horizontally and vertically for ages. I've tried margin: auto, flexbox, and grid, but what is the most reliable and modern method...",
    fullQuestion:
      "I've been trying to center a div both horizontally and vertically for ages. I've tried margin: auto, flexbox, and grid, but what is the most reliable and modern method to achieve perfect centering in CSS for various screen sizes and content types? Are there any new CSS properties or best practices I should be aware of?",
    votes: 125,
    tags: ["css", "flexbox", "layout"],
    answers: 5,
    views: "2.1k",
    author: "JaneDoe",
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    title: "Understanding React Hooks useEffect dependencies",
    excerpt:
      "I'm struggling to understand when to include dependencies in the useEffect hook. Sometimes my component re-renders unexpectedly...",
    fullQuestion:
      "I'm struggling to understand when to include dependencies in the useEffect hook. Sometimes my component re-renders unexpectedly, or I get stale closures. Can someone explain the rules for useEffect dependencies clearly, especially for common scenarios like fetching data or setting up event listeners?",
    votes: 88,
    tags: ["react", "hooks", "javascript"],
    answers: 12,
    views: "1.5k",
    author: "ReactFan",
    timeAgo: "1 day ago",
  },
  {
    id: "3",
    title: "Best practices for Next.js API routes authentication",
    excerpt:
      "What are the recommended best practices for handling authentication in Next.js API routes? I'm looking for secure and scalable solutions...",
    fullQuestion:
      "What are the recommended best practices for handling authentication in Next.js API routes? I'm looking for secure and scalable solutions, considering both server-side and client-side authentication flows. Should I use JWTs, sessions, or a third-party library like NextAuth.js?",
    votes: 70,
    tags: ["nextjs", "authentication", "api"],
    answers: 8,
    views: "1.8k",
    author: "NextDev",
    timeAgo: "3 days ago",
  },
];

export const answers = {
  1: [
    {
      id: "a1",
      author: "CSSMaster",
      timeAgo: "1 hour ago",
      votes: 50,
      content:
        "The most modern and reliable way to center a div both horizontally and vertically is using Flexbox. Apply `display: flex; justify-content: center; align-items: center;` to the parent container. This works great for single items. For multiple items or more complex layouts, CSS Grid is also an excellent choice with `display: grid; place-items: center;` on the parent.",
    },
    {
      id: "a2",
      author: "GridGuru",
      timeAgo: "45 minutes ago",
      votes: 30,
      content:
        "I second the Flexbox approach for simple centering. However, if you're dealing with a more complex layout or need to center multiple items within a grid, `display: grid; place-items: center;` on the parent is incredibly powerful and concise. It handles both horizontal and vertical centering with a single property.",
    },
    {
      id: "a3",
      author: "OldSchoolDev",
      timeAgo: "30 minutes ago",
      votes: 10,
      content:
        "While Flexbox and Grid are great, don't forget the classic `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);` for specific cases where you need to center an element relative to its positioned parent without affecting flow. It's still useful sometimes!",
    },
  ],
  2: [
    {
      id: "a4",
      author: "HookExpert",
      timeAgo: "20 hours ago",
      votes: 40,
      content:
        "The `useEffect` dependency array tells React when to re-run the effect. If a value in the array changes between renders, the effect re-runs. If it's an empty array `[]`, the effect runs once after the initial render and cleans up on unmount. If you omit the array, it runs after every render. Always include all values from your component scope that the effect uses and that can change over time (props, state, functions).",
    },
    {
      id: "a5",
      author: "ReactLearner",
      timeAgo: "18 hours ago",
      votes: 15,
      content:
        "A common pitfall is forgetting to memoize functions or objects that are used in `useEffect` dependencies. If a function or object is recreated on every render, it will cause the effect to re-run unnecessarily. Use `useCallback` for functions and `useMemo` for objects to prevent this.",
    },
  ],
};
