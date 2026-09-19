import { LinkedInReviewReport, UserProfile } from '../types';

export interface LinkedInCVResult {
  atsScore: number;
  fullName: string;
  targetRole: string;
  summary: string;
  skills: string[];
  bulletPoints: Array<{
    category: string;
    original: string;
    optimized: string;
    metrics: string;
  }>;
  recommendedKeywords: string[];
}

export function analyzeLinkedIn(
  profileUrl: string,
  profile: UserProfile,
  headlineInput?: string,
  aboutInput?: string,
  experienceInput?: string
): LinkedInReviewReport & { optimizedCV?: LinkedInCVResult } {
  // Extract handle or name from URL
  const rawSlug = profileUrl.split(/linkedin\.com\/in\//i)[1]?.split(/[/?#]/)[0] || '';
  const inferredName = rawSlug
    ? rawSlug
        .replace(/[-_.]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim()
    : profile.full_name || 'Sarah Joe';

  const userSkills = profile.skills?.length
    ? profile.skills
    : ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Git', 'REST APIs'];

  const primarySkill = userSkills[0] || 'Frontend';
  const secondarySkill = userSkills[1] || 'TypeScript';

  const currentHeadline =
    headlineInput?.trim() ||
    `${primarySkill} Developer | ${userSkills.slice(0, 3).join(', ')} | Open to Opportunities`;

  const currentAbout =
    aboutInput?.trim() ||
    `Software developer with hands-on experience building user-centric web applications and responsive interfaces. Seeking growth opportunities and impact-driven roles.`;

  const strengthScore = headlineInput && aboutInput ? 82 : 75;

  const headlineIssues = [
    `Your headline should emphasize high-intent search keywords (${userSkills.slice(0, 3).join(', ')}) that tech recruiters actively filter for.`,
    'Include your core technical specialty and measurable domain focus in the first 45 characters.',
  ];

  const suggestedRewrites = [
    `${primarySkill} Engineer (${userSkills.slice(0, 3).join(' • ')}) | Building High-Performance Web Applications | Open to Impact-Driven Roles`,
    `Software Engineer & Tech Builder | ${userSkills.slice(0, 4).join(' • ')} | Seeking 2026 Engineering Opportunities`,
    `${primarySkill} Developer | Specializing in Accessible Interfaces, Modern Web Standards & Scalable Systems`,
  ];

  const suggestedAboutRewrite = `I am a ${primarySkill.toLowerCase()} software developer passionate about crafting accessible, high-performance web applications that solve real-world problems.

Over the past two years, I have built production-grade applications with ${userSkills.slice(0, 4).join(', ')}, collaborating with engineering teams and community networks to scale impactful digital tools.

Core Technical Stack:
- Frontend: ${userSkills.filter((s) => ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML/CSS', 'Next.js'].includes(s)).join(', ') || 'React, TypeScript, Tailwind CSS, Modern JavaScript'}
- Development Practices: Git, RESTful APIs, Component-Driven Design, Responsive Layouts, Performance Optimization
- Soft Skills: Technical Communication, Collaborative Problem Solving, Fast Learner

What I am seeking:
Engineering roles, technical fellowships, and collaborative software projects where I can contribute clean code and drive tangible user impact.

Let's connect: ${profile.email || 'candidate@oppmatch.app'}`;

  const bulletImprovements = [
    {
      original:
        experienceInput ||
        'Built responsive web components and worked on site styling and bug fixes.',
      improved: `Architected and deployed 6+ modular ${primarySkill} components, improving mobile performance by 35% and enhancing interface accessibility.`,
      formula: 'Action Verb + What You Built + Metric / Impact',
    },
    {
      original: 'Collaborated with team on community projects and hackathons.',
      improved: `Co-engineered interactive fullstack MVP serving 250+ active testers; implemented real-time state synchronization using ${secondarySkill}.`,
      formula: 'Technical Scope + Tooling + Measured Adoption',
    },
  ];

  const skillsGap = [
    {
      skill: 'TypeScript',
      importance: 'Appears in 85% of modern frontend and fullstack job descriptions on LinkedIn. Pin to top 3 skills.',
    },
    {
      skill: 'Git & Open Source Workflow',
      importance: 'Essential verification signal for technical hiring managers and fellowship evaluators.',
    },
    {
      skill: 'AI Tooling & Prompt Architecture',
      importance: 'Key differentiator for modern engineers building efficient user-facing workflows.',
    },
  ];

  const optimizedCV: LinkedInCVResult = {
    atsScore: 88,
    fullName: inferredName,
    targetRole: `${primarySkill} Software Engineer`,
    summary: `Results-driven ${primarySkill} Engineer with proven expertise building scalable, responsive web applications using ${userSkills.slice(0, 4).join(', ')}. Passionate about accessible user experience and maintainable architecture.`,
    skills: userSkills,
    bulletPoints: [
      {
        category: 'Work Experience',
        original: 'Built user interfaces and worked on component development.',
        optimized: `Engineered responsive client-side features using ${userSkills.slice(0, 3).join(', ')}, achieving a 40% reduction in layout shift and 100% WCAG accessibility compliance.`,
        metrics: '40% performance gain',
      },
      {
        category: 'Project Delivery',
        original: 'Created application prototypes for hackathons and student initiatives.',
        optimized: `Developed and launched fullstack web application with secure client-side persistence and interactive search; demoed live to 300+ community participants.`,
        metrics: '300+ active demo users',
      },
    ],
    recommendedKeywords: [
      primarySkill,
      secondarySkill,
      'REST APIs',
      'Git / GitHub',
      'Performance Optimization',
      'Responsive Web Design',
      'State Management',
    ],
  };

  return {
    id: 'li-' + Date.now(),
    profileUrl,
    analysisDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    strengthScore,
    headlineIssues,
    isUnlocked: true, // Unlocked so user gets full real-time optimization immediately!
    headlineAnalysis: {
      current: currentHeadline,
      critique:
        'Recruiters search LinkedIn by exact technical skills, role clarity, and value proposition. Your headline should clearly broadcast your stack and target domain.',
      suggestedRewrites,
    },
    aboutSectionAnalysis: {
      critique:
        'Your About section should capture attention before the "...see more" cutoff, follow a clear narrative arc, and list searchable keywords for algorithmic ranking.',
      suggestedRewrite: suggestedAboutRewrite,
      keyHighlights: [
        'Clarifies technical focus and core stack within the opening 2 lines',
        'Includes formatted keyword blocks optimized for LinkedIn recruiter search',
        'Includes a direct, friction-free contact method and call to action',
      ],
    },
    experienceFeedback: {
      critique:
        'Recruiter algorithms and hiring managers favor action-oriented bullet points containing measurable results over passive responsibility lists.',
      bulletImprovements,
    },
    skillsGap,
    completenessChecklist: [
      {
        id: 'li-1',
        item: 'Professional High-Contrast Photo',
        status: 'completed',
        tip: 'Ensure clean, neutral background and clear eye-level lighting.',
      },
      {
        id: 'li-2',
        item: 'Custom Headline with Top 3 Tech Skills',
        status: 'suboptimal',
        tip: 'Update your headline with the suggested rewrite above to increase search impressions.',
      },
      {
        id: 'li-3',
        item: 'Keyword-Rich About Section',
        status: 'completed',
        tip: 'Use the generated About section to pass recruiter keyword scans.',
      },
      {
        id: 'li-4',
        item: 'Featured Section with Live Project Links',
        status: 'completed',
        tip: 'Pin your top GitHub repository and live demo URL to showcase proof of craft.',
      },
      {
        id: 'li-5',
        item: 'Customized LinkedIn URL Handle',
        status: 'completed',
        tip: `Ensure your custom URL (${profileUrl}) is clean and present on your resume.`,
      },
    ],
    optimizedCV,
  };
}
