import { CVReviewReport, Opportunity, UserProfile } from '../types';

export function analyzeCV(
  fileName: string,
  cvText: string,
  profile: UserProfile,
  matchedOpportunities: Opportunity[]
): CVReviewReport {
  // Extract high-demand skills from user's matched opportunities
  const matchedOppSkills = Array.from(
    new Set(matchedOpportunities.flatMap((o) => o.skills))
  );
  const userSkillsLower = profile.skills.map((s) => s.toLowerCase());

  // Detect which skills from matched opportunities are missing
  const missingFromMatchedOpps = matchedOppSkills
    .filter((s) => !userSkillsLower.includes(s.toLowerCase()))
    .slice(0, 3)
    .map((skill) => {
      const oppsWithSkill = matchedOpportunities.filter((o) =>
        o.skills.some((sk) => sk.toLowerCase() === skill.toLowerCase())
      ).length;
      return {
        skill,
        matchedOppsCount: Math.max(1, oppsWithSkill),
        recommendation: `Adding a project or coursework demonstrating ${skill} would boost your match score for ${oppsWithSkill} top opportunities on OppMatch.`,
      };
    });

  // Calculate base score
  const hasQuantified = cvText.match(/\d+%/g) || cvText.match(/\$\d+/g) || cvText.match(/\b\d+\s*(users|clients|students|projects|teams)\b/i);
  const hasProjects = cvText.toLowerCase().includes('project') || profile.experience.length > 50;
  const hasClearSkills = profile.skills.length >= 4;

  let baseScore = 68;
  if (hasQuantified) baseScore += 10;
  if (hasProjects) baseScore += 8;
  if (hasClearSkills) baseScore += 8;
  const score = Math.min(94, Math.max(58, baseScore));

  const headlineIssues: string[] = [];
  if (!hasQuantified) {
    headlineIssues.push('No quantified achievements: experience bullets describe duties rather than measurable business/technical outcomes.');
  }
  if (missingFromMatchedOpps.length > 0) {
    headlineIssues.push(`Missing high-demand keywords: your target opportunities frequently require ${missingFromMatchedOpps[0]?.skill || 'Python/Cloud'}, which is absent.`);
  }
  headlineIssues.push('ATS header risk: ensure contact info is in standard plain text body rather than nested inside graphical tables.');

  return {
    id: 'cvr-' + Date.now(),
    fileName: fileName || 'Resume_Sarah_Joe.pdf',
    uploadDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    score,
    headlineIssues,
    isUnlocked: false, // Starts locked on free tier
    atsReadability: {
      score: 74,
      formatHealth: 'Medium',
      parsingRisk: 'Low-to-Medium (Standard single-column structure parsed well, but multi-line skill tags could confuse older ATS parsers).',
      missingKeywords: missingFromMatchedOpps.map((m) => m.skill).concat(['Agile / Scrum', 'Unit Testing']),
    },
    sectionFeedback: [
      {
        section: 'Professional Summary / Objective',
        score: 70,
        feedback: 'Too passive and generic. State your track record immediately (e.g. "Frontend developer specializing in React and accessible web apps, with experience building civic-tech prototypes").',
        status: 'warning',
      },
      {
        section: 'Technical Skills Matrix',
        score: 85,
        feedback: 'Well organized by category (Languages, Frameworks, Developer Tools). Grouping frontend libraries separately from fundamentals makes it easy for recruiters to scan in 6 seconds.',
        status: 'good',
      },
      {
        section: 'Work & Internship Experience',
        score: 62,
        feedback: 'Several bullets start with passive verbs like "Responsible for" or "Assisted with". Replace with strong action verbs like "Architected", "Spearheaded", "Optimized", or "Delivered".',
        status: 'critical',
      },
      {
        section: 'Projects & Open Source',
        score: 78,
        feedback: 'Good project descriptions, but missing live demonstration links or metrics (e.g., test coverage, page speed index, active testers).',
        status: 'warning',
      },
      {
        section: 'Education & Honors',
        score: 90,
        feedback: `Clear university affiliation (${profile.school || 'UNILAG'}) and degree status. Relevant coursework and leadership roles are visible.`,
        status: 'good',
      },
    ],
    lineRewrites: [
      {
        section: 'Internship Experience',
        original: 'Assisted in building website pages using React and styling components for customer dashboard.',
        improved: 'Spearheaded development of 4 responsive React dashboard views, reducing page load times by 28% across 1,200+ monthly active users.',
        reason: 'Replaces passive "assisted in" with active ownership and injects concrete performance and user metrics.',
      },
      {
        section: 'University Project',
        original: 'Worked on a team hackathon app that helps students find campus study rooms.',
        improved: 'Co-developed full-stack campus utility in 48 hours using React and Node.js, winning 2nd place among 34 collegiate teams.',
        reason: 'Adds scope, tech stack, and competition outcome verification.',
      },
      {
        section: 'Open Source / Volunteering',
        original: 'Helped organize student tech workshops and fixed bugs in open source repos.',
        improved: 'Mentored 45+ undergraduates in Git fundamentals and authored 6 accepted pull requests to community developer repositories.',
        reason: 'Quantifies cohort reach and highlights tangible open source contributions.',
      },
    ],
    missingSkillsGaps: missingFromMatchedOpps,
    actionChecklist: [
      {
        id: 'act-1',
        task: 'Add at least 2 quantified metrics (e.g., % speed improved, number of users, accuracy rate) to your experience section.',
        impact: 'High',
        estimatedTime: '20 mins',
        done: false,
      },
      {
        id: 'act-2',
        task: `Insert missing keywords (${missingFromMatchedOpps.map((m) => m.skill).join(', ') || 'AI / Python'}) in your projects section to align with matched opportunities.`,
        impact: 'High',
        estimatedTime: '15 mins',
        done: false,
      },
      {
        id: 'act-3',
        task: 'Ensure CV is strictly 1 single page; trim older high-school accomplishments and consolidate whitespace.',
        impact: 'Medium',
        estimatedTime: '10 mins',
        done: false,
      },
      {
        id: 'act-4',
        task: 'Replace generic email with clean institutional or personal domain, and include active GitHub and LinkedIn hyperlinks.',
        impact: 'Medium',
        estimatedTime: '5 mins',
        done: true,
      },
    ],
  };
}
