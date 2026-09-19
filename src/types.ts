export type OpportunityType =
  | 'hackathon'
  | 'scholarship'
  | 'fellowship'
  | 'internship'
  | 'job'
  | 'grant'
  | 'bootcamp'
  | 'accelerator'
  | 'competition'
  | 'volunteer'
  | 'ambassador'
  | 'conference'
  | 'mentorship';

export type CareerLevel =
  | 'student'
  | 'recent_graduate'
  | 'early_career'
  | 'beginner'
  | 'intermediate'
  | 'mid_career'
  | 'career_switcher'
  | 'experienced'
  | 'returning_to_work';

export type EducationLevel =
  | 'none'
  | 'self_taught'
  | 'bootcamp'
  | 'high_school'
  | 'undergraduate'
  | 'university'
  | 'graduate'
  | 'postgraduate'
  | 'any';

export type OpportunityStatus = 'verified' | 'featured' | 'needs_verification' | 'open';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  description: string;
  eligibility: string;
  location: string;
  remote: boolean;
  deadline: string;
  skills: string[];
  career_level: CareerLevel[];
  education_level: EducationLevel[];
  gender_requirement?: 'women_only' | 'all' | 'underrepresented';
  age_requirement?: string;
  country_requirement: string[];
  field: string;
  funding_or_prize: string;
  application_url: string;
  source_url: string;
  community_id?: string;
  status: OpportunityStatus;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  social_links: {
    twitter?: string;
    linkedin?: string;
    slack_or_discord?: string;
    telegram?: string;
  };
  focus_areas: string[];
  countries: string[];
  members_type: string[];
  skills: string[];
  community_type: string;
  verified: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  location: string;
  country: string;
  education?: string;
  school?: string;
  career_level: CareerLevel;
  skills: string[];
  interests: string[];
  preferred_categories: OpportunityType[];
  remote_preference: 'remote' | 'onsite' | 'both';
  experience: string;
  goals: string;
  created_at?: string;
  updated_at?: string;
}

export interface MatchExplanation {
  matchPercentage: number;
  summarySentence: string;
  whyYouMatch: string[];
  potentialGaps: string[];
  scoreBreakdown: {
    skills: number;
    education: number;
    location: number;
    careerLevel: number;
    interest: number;
  };
}

export interface CommunityRecommendation {
  community: Community;
  matchPercentage: number;
  whyRecommend: string;
}

export interface ApplicationTimelineItem {
  phase: string;
  timing: string;
  details: string;
  completed?: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  category: 'docs' | 'prep' | 'action';
}

export interface ApplicationAssistantData {
  checklist: ChecklistItem[];
  requiredDocuments: string[];
  eligibilitySummary: string;
  preparationTasks: string[];
  suggestedTimeline: ApplicationTimelineItem[];
  gapsToAddress: string[];
}

export type PipelineStage = 'saved' | 'preparing' | 'applied' | 'submitted' | 'outcome';

export interface TrackedApplication {
  opportunityId: string;
  stage: PipelineStage;
  notes: string;
  dateAdded: string;
  lastUpdated: string;
}

export interface CVReviewReport {
  id: string;
  fileName: string;
  uploadDate: string;
  score: number;
  headlineIssues: string[];
  isUnlocked: boolean;
  atsReadability: {
    score: number;
    formatHealth: 'High' | 'Medium' | 'Needs Attention';
    parsingRisk: string;
    missingKeywords: string[];
  };
  sectionFeedback: {
    section: string;
    score: number;
    feedback: string;
    status: 'good' | 'warning' | 'critical';
  }[];
  lineRewrites: {
    section: string;
    original: string;
    improved: string;
    reason: string;
  }[];
  missingSkillsGaps: {
    skill: string;
    matchedOppsCount: number;
    recommendation: string;
  }[];
  actionChecklist: {
    id: string;
    task: string;
    impact: 'High' | 'Medium';
    estimatedTime: string;
    done: boolean;
  }[];
}

export interface LinkedInReviewReport {
  id: string;
  profileUrl: string;
  analysisDate: string;
  strengthScore: number;
  headlineIssues: string[];
  isUnlocked: boolean;
  headlineAnalysis: {
    current: string;
    critique: string;
    suggestedRewrites: string[];
  };
  aboutSectionAnalysis: {
    critique: string;
    suggestedRewrite: string;
    keyHighlights: string[];
  };
  experienceFeedback: {
    critique: string;
    bulletImprovements: {
      original: string;
      improved: string;
      formula: string;
    }[];
  };
  skillsGap: {
    skill: string;
    importance: string;
  }[];
  completenessChecklist: {
    id: string;
    item: string;
    status: 'completed' | 'missing' | 'suboptimal';
    tip: string;
  }[];
}
