import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Shared';
export const ScreenIndex = () => {
  const groups = [
  {
    title: 'Onboarding & Auth',
    links: [
    {
      path: '/',
      label: '1. Splash'
    },
    {
      path: '/onboarding-1',
      label: '2. Onboarding 1'
    },
    {
      path: '/onboarding-2',
      label: '3. Onboarding 2'
    },
    {
      path: '/onboarding-3',
      label: '4. Onboarding 3'
    },
    {
      path: '/signin',
      label: '5. Sign In'
    },
    {
      path: '/signup',
      label: '6. Sign Up'
    },
    {
      path: '/forgot-password',
      label: '7. Forgot Password'
    },
    {
      path: '/verify-otp',
      label: '8. Verify OTP'
    }]

  },
  {
    title: 'Profile Setup',
    links: [
    {
      path: '/setup-basic',
      label: '9. Basic Info'
    },
    {
      path: '/setup-career',
      label: '10. Career Goal'
    },
    {
      path: '/setup-experience',
      label: '11. Experience Level'
    },
    {
      path: '/setup-industry',
      label: '12. Industry Selection'
    },
    {
      path: '/setup-skills',
      label: '13. Skill Assessment'
    }]

  },
  {
    title: 'Home & Discovery',
    links: [
    {
      path: '/dashboard',
      label: '14. Dashboard'
    },
    {
      path: '/search',
      label: '15. Search & Browse'
    },
    {
      path: '/categories',
      label: '16. Categories'
    },
    {
      path: '/recommended',
      label: '17. Recommended'
    },
    {
      path: '/notifications',
      label: '18. Notifications'
    }]

  },
  {
    title: 'Interview Setup',
    links: [
    {
      path: '/interview-setup',
      label: '19. Type Selection'
    },
    {
      path: '/interview-role',
      label: '20. Role Selection'
    },
    {
      path: '/interview-difficulty',
      label: '21. Difficulty'
    },
    {
      path: '/interview-format',
      label: '22. Format'
    },
    {
      path: '/interview-precheck',
      label: '23. Pre-check'
    }]

  },
  {
    title: 'Live Interview',
    links: [
    {
      path: '/live-waiting',
      label: '24. Waiting Room'
    },
    {
      path: '/live-video',
      label: '25. Video Interview (with 28. Tips)'
    },
    {
      path: '/live-voice',
      label: '26. Voice Interview'
    },
    {
      path: '/live-text',
      label: '27. Text Interview'
    },
    {
      path: '/live-pause',
      label: '29. Pause/Break'
    }]

  },
  {
    title: 'Feedback',
    links: [
    {
      path: '/feedback-summary',
      label: '30. Summary'
    },
    {
      path: '/feedback-detailed',
      label: '31. Detailed Report'
    },
    {
      path: '/feedback-confidence',
      label: '32. Confidence Breakdown'
    },
    {
      path: '/feedback-speech',
      label: '33. Speech Analysis'
    },
    {
      path: '/feedback-body',
      label: '34. Body Language'
    },
    {
      path: '/feedback-answers',
      label: '35. Answer Review'
    },
    {
      path: '/feedback-improvements',
      label: '36. Improvements'
    },
    {
      path: '/ai-vs-traditional',
      label: '37. AI vs Traditional'
    }]

  },
  {
    title: 'Analytics',
    links: [
    {
      path: '/analytics',
      label: '38. Progress Dashboard'
    },
    {
      path: '/analytics-trends',
      label: '39. Trends'
    },
    {
      path: '/analytics-heatmap',
      label: '40. Heatmap'
    },
    {
      path: '/analytics-achievements',
      label: '41. Achievements'
    },
    {
      path: '/history',
      label: '42. History'
    }]

  },
  {
    title: 'Practice',
    links: [
    {
      path: '/practice',
      label: '43. Question Bank'
    },
    {
      path: '/practice-answer',
      label: '44. Sample Answer'
    },
    {
      path: '/practice-mocks',
      label: '45. Mock Library'
    },
    {
      path: '/practice-daily',
      label: '46. Daily Practice'
    },
    {
      path: '/practice-resources',
      label: '47. Resources'
    }]

  },
  {
    title: 'Community & Settings',
    links: [
    {
      path: '/community',
      label: '48. Leaderboard'
    },
    {
      path: '/community-mentor',
      label: '49. Mentor Connect'
    },
    {
      path: '/settings',
      label: '50. Settings'
    }]

  }];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              AInterview Screen Index
            </h1>
            <p className="text-slate-500">All 50 screens for the prototype.</p>
          </div>
          <Link to="/" className="text-indigo-600 font-medium hover:underline">
            Start Flow →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, i) =>
          <Card key={i} className="p-6">
              <h2 className="font-bold text-lg text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {group.title}
              </h2>
              <ul className="space-y-2">
                {group.links.map((link, j) =>
              <li key={j}>
                    <Link
                  to={link.path}
                  className="text-slate-600 hover:text-indigo-600 hover:underline text-sm block py-1">
                  
                      {link.label}
                    </Link>
                  </li>
              )}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>);

};