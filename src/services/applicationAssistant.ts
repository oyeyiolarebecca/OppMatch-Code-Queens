import { ApplicationAssistantData, Opportunity, UserProfile } from '../types';

export function generateApplicationAssistantData(
  opportunity: Opportunity,
  profile: UserProfile
): ApplicationAssistantData {
  const isHackathonOrComp =
    opportunity.type === 'hackathon' || opportunity.type === 'competition';
  const isScholarshipOrGrant =
    opportunity.type === 'scholarship' || opportunity.type === 'grant';
  const isJobOrInternship =
    opportunity.type === 'job' || opportunity.type === 'internship' || opportunity.type === 'fellowship';
  const isAmbassadorOrCommunity =
    opportunity.type === 'ambassador' || opportunity.type === 'volunteer' || opportunity.type === 'mentorship';

  // Required Documents
  const requiredDocuments: string[] = [];
  if (isScholarshipOrGrant) {
    requiredDocuments.push('Updated Academic Transcript / Proof of Enrollment');
    requiredDocuments.push('Statement of Purpose (500–700 words)');
    requiredDocuments.push('1 Academic or Professional Reference Letter');
    requiredDocuments.push('Valid Student ID or National ID (NIN)');
  } else if (isJobOrInternship) {
    requiredDocuments.push('ATS-Tailored 1-Page Tech Resume (PDF)');
    requiredDocuments.push('GitHub / GitLab Profile with 2+ active repos');
    requiredDocuments.push('Portfolio or Live Demo Links');
    requiredDocuments.push('Brief Cover Note / Motivation Statement');
  } else if (isHackathonOrComp) {
    requiredDocuments.push('GitHub Repository or Project Workspace Link');
    requiredDocuments.push('2-Minute Loom/Video Demo or Pitch Deck');
    requiredDocuments.push('Team Member Details & Role Breakdown');
    requiredDocuments.push('Architecture Diagram & Problem Statement Writeup');
  } else {
    requiredDocuments.push('Personal Motivation Essay (Why you want to join)');
    requiredDocuments.push('Summary of Past Community / Campus Initiatives');
    requiredDocuments.push('Updated LinkedIn or Tech Profile URL');
  }

  // Preparation Tasks
  const preparationTasks: string[] = [];
  preparationTasks.push(
    `Review key criteria: verify your ${profile.country || 'Nigeria'} eligibility and ${profile.education || 'university'} status documentation.`
  );
  if (opportunity.skills.length > 0) {
    preparationTasks.push(
      `Polish highlighted skills: ensure your repository has demonstrable samples in ${opportunity.skills.slice(0, 3).join(', ')}.`
    );
  }
  if (isHackathonOrComp) {
    preparationTasks.push(
      'Draft a concrete MVP scope addressing the social impact challenge statement before team submission.'
    );
  } else if (isJobOrInternship) {
    preparationTasks.push(
      'Practice technical phone-screen questions covering data structures and web development fundamentals.'
    );
  } else {
    preparationTasks.push(
      'Identify 2 concrete goals you will achieve during this cohort to detail in your application essay.'
    );
  }

  // Gaps to Address Before Applying
  const gapsToAddress: string[] = [];
  const userSkills = profile.skills.map((s) => s.toLowerCase());
  const missing = opportunity.skills.filter((s) => !userSkills.some((us) => us.includes(s.toLowerCase())));
  if (missing.length > 0) {
    gapsToAddress.push(
      `Familiarize yourself with ${missing.slice(0, 2).join(' & ')} through an introductory tutorial or mini-repo.`
    );
  }
  gapsToAddress.push(
    'Have a mentor or peer review your submission pitch or CV 48 hours prior to deadline.'
  );
  if (!profile.experience || profile.experience.length < 40) {
    gapsToAddress.push(
      'Flesh out your project descriptions with measurable outcomes (e.g. users reached, performance improvements).'
    );
  }

  // Suggested Timeline
  const suggestedTimeline = [
    {
      phase: 'Phase 1: Readiness & Verification',
      timing: 'Today – Day 3',
      details: 'Confirm eligibility, gather ID and university transcript, draft personal motivation statement.',
    },
    {
      phase: 'Phase 2: Project & Document Polish',
      timing: 'Day 4 – Day 8',
      details: `Align GitHub repos, ensure READMEs are clear, and highlight ${opportunity.skills[0] || 'relevant'} skills.`,
    },
    {
      phase: 'Phase 3: Review & Submission',
      timing: '48 hrs before deadline',
      details: `Double-check ${opportunity.organization}'s application form, test live links, and submit early.`,
    },
    {
      phase: 'Phase 4: Follow-up & Community',
      timing: 'Post-submission',
      details: 'Save submission confirmation, join related Discord/Slack channels, and prepare for potential interview.',
    },
  ];

  // Checklist
  const checklist = [
    {
      id: 'chk-1',
      text: `Confirm eligibility criteria (${opportunity.country_requirement.join('/')} residency & ${opportunity.education_level.join('/')} level)`,
      done: true,
      category: 'prep' as const,
    },
    {
      id: 'chk-2',
      text: `Prepare required documents (${requiredDocuments[0] || 'Resume'})`,
      done: false,
      category: 'docs' as const,
    },
    {
      id: 'chk-3',
      text: 'Run CV or Portfolio through OppMatch review to catch missing keywords',
      done: false,
      category: 'prep' as const,
    },
    {
      id: 'chk-4',
      text: `Draft custom answers tailored to ${opportunity.organization}'s mission`,
      done: false,
      category: 'action' as const,
    },
    {
      id: 'chk-5',
      text: `Submit application before deadline (${opportunity.deadline}) and save confirmation`,
      done: false,
      category: 'action' as const,
    },
  ];

  const eligibilitySummary = `This opportunity is hosted by ${opportunity.organization} and prioritizes ${opportunity.career_level.join(' and ')} applicants. Location requirement is ${opportunity.location} (${opportunity.remote ? 'Remote supported' : 'On-site required'}). Eligible countries: ${opportunity.country_requirement.join(', ')}. Target education: ${opportunity.education_level.join(', ')}.`;

  return {
    checklist,
    requiredDocuments,
    eligibilitySummary,
    preparationTasks,
    suggestedTimeline,
    gapsToAddress,
  };
}
