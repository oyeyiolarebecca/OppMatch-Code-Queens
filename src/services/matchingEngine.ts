import {
  Community,
  CommunityRecommendation,
  MatchExplanation,
  Opportunity,
  UserProfile,
} from '../types';

export function calculateOpportunityMatch(
  profile: UserProfile,
  opp: Opportunity
): MatchExplanation {
  const whyYouMatch: string[] = [];
  const potentialGaps: string[] = [];

  let educationScore = 0;
  let locationScore = 0;
  let careerLevelScore = 0;
  let skillsScore = 0;
  let interestScore = 0;

  // 1. Location / Country Reasoning
  const userCountry = (profile.country || 'Nigeria').toLowerCase();
  const oppCountries = opp.country_requirement.map((c) => c.toLowerCase());
  const isPanAfrica = oppCountries.includes('africa') || oppCountries.includes('pan-africa');
  const isGlobal = oppCountries.includes('global') || oppCountries.includes('worldwide');
  const isCountryDirectMatch = oppCountries.includes(userCountry);

  if (isCountryDirectMatch) {
    locationScore = 100;
    whyYouMatch.push(`${profile.country || 'Nigerian'} applicants explicitly eligible`);
  } else if (isPanAfrica && (userCountry === 'nigeria' || userCountry === 'ghana' || userCountry === 'kenya')) {
    locationScore = 95;
    whyYouMatch.push(`Pan-African applicant criteria satisfied (${profile.country || 'Nigeria'} covered)`);
  } else if (isGlobal) {
    locationScore = 90;
    whyYouMatch.push('Open globally without regional geographic restrictions');
  } else {
    locationScore = 40;
    potentialGaps.push(`Geographic focus is primarily on ${opp.country_requirement.join(', ')}`);
  }

  // Remote vs Onsite preference
  if (opp.remote) {
    if (profile.remote_preference === 'remote' || profile.remote_preference === 'both') {
      locationScore = Math.min(100, locationScore + 5);
      whyYouMatch.push('Fully remote participation supported with your remote preference');
    }
  } else {
    // In-person or hybrid
    if (profile.location && opp.location.toLowerCase().includes(profile.location.split(',')[0].toLowerCase())) {
      whyYouMatch.push(`On-site location (${opp.location}) is accessible from your base in ${profile.location}`);
    } else {
      potentialGaps.push(`Requires physical attendance in ${opp.location} (requires travel/logistics check)`);
    }
  }

  // 2. Education Level Reasoning
  const oppEdu = opp.education_level;
  const userEdu = profile.education || 'undergraduate';

  if (oppEdu.includes('any') || oppEdu.includes(userEdu as any)) {
    educationScore = 100;
    if (userEdu === 'undergraduate' || userEdu === 'university') {
      whyYouMatch.push(`University student accepted (${profile.school || 'Undergraduate program'})`);
    } else {
      whyYouMatch.push(`Your education background (${userEdu}) satisfies eligibility`);
    }
  } else if (oppEdu.includes('university') && userEdu === 'undergraduate') {
    educationScore = 100;
    whyYouMatch.push('University enrollment criteria fully satisfied');
  } else {
    educationScore = 50;
    potentialGaps.push(`Targeted education level is ${oppEdu.join(' or ')} (review specific transcripts)`);
  }

  // 3. Career Level Reasoning
  const oppCareer = opp.career_level;
  const userCareer = profile.career_level || 'student';

  if (oppCareer.includes(userCareer)) {
    careerLevelScore = 100;
    whyYouMatch.push(`Designed for ${userCareer} stage applicants with early-stage experience`);
  } else if (userCareer === 'student' && oppCareer.includes('beginner')) {
    careerLevelScore = 90;
    whyYouMatch.push('Welcomes beginner & early-career contributors');
  } else {
    careerLevelScore = 60;
    potentialGaps.push(`Typically targets ${oppCareer.join('/')} level profiles`);
  }

  // 4. Skills Reasoning (Reasoning over exact and related skills)
  const userSkills = (profile.skills || []).map((s) => s.toLowerCase());
  const oppSkills = (opp.skills || []).map((s) => s.toLowerCase());

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  oppSkills.forEach((reqSkill) => {
    const isDirectMatch = userSkills.some(
      (us) => us.includes(reqSkill) || reqSkill.includes(us)
    );
    if (isDirectMatch) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  // Calculate skill score
  const matchRatio = oppSkills.length > 0 ? matchedSkills.length / oppSkills.length : 1;
  skillsScore = Math.round(Math.min(100, Math.max(35, matchRatio * 100 + (matchedSkills.length > 0 ? 15 : 0))));

  if (matchedSkills.length > 0) {
    const highlight = matchedSkills.slice(0, 3).map((s) => s.toUpperCase()).join(', ');
    whyYouMatch.push(`${highlight} skills directly relevant to the requirements`);
  }

  if (missingSkills.length > 0) {
    const gapSkill = missingSkills[0];
    const capitalized = gapSkill.charAt(0).toUpperCase() + gapSkill.slice(1);
    potentialGaps.push(
      `${capitalized} experience is preferred for this opportunity but not yet prominent on your profile`
    );
  }

  // 5. Interests, Category & Goals Reasoning
  const userInterests = (profile.interests || []).map((i) => i.toLowerCase());
  const userCategories = profile.preferred_categories || [];

  let interestMatches = 0;
  if (userCategories.includes(opp.type)) {
    interestMatches += 2;
    whyYouMatch.push(`Directly matches your saved category goal (${opp.type.toUpperCase()})`);
  }

  const oppField = opp.field.toLowerCase();
  const oppTitle = opp.title.toLowerCase();
  const oppDesc = opp.description.toLowerCase();

  userInterests.forEach((interest) => {
    if (oppField.includes(interest) || oppTitle.includes(interest) || oppDesc.includes(interest)) {
      interestMatches++;
      whyYouMatch.push(`${interest.charAt(0).toUpperCase() + interest.slice(1)} interest aligns strongly with the theme`);
    }
  });

  interestScore = Math.min(100, Math.max(40, 50 + interestMatches * 15));

  // Additional special conditions: gender requirements
  if (opp.gender_requirement === 'women_only') {
    // In social impact context, indicate track verification
    whyYouMatch.push('Inclusive track prioritizing women developers and gender equity in tech');
  }

  // Overall weighted score
  // Skills: 35%, Eligibility (Edu + Location + Career): 40%, Interest/Goals: 25%
  const totalWeighted = Math.round(
    skillsScore * 0.35 +
      locationScore * 0.20 +
      educationScore * 0.15 +
      careerLevelScore * 0.10 +
      interestScore * 0.20
  );

  // Bound score realistically between 55% and 96% for positive encouragement with honest gaps
  const boundedMatchPercentage = Math.min(96, Math.max(52, totalWeighted));

  // Craft the required plain-language summary sentence
  const studentType =
    userEdu === 'undergraduate' || userEdu === 'university'
      ? `${profile.country || 'Nigerian'} university student`
      : `${profile.country || 'Nigerian'} ${profile.career_level || 'early-career'} developer`;

  const topSkillStr = profile.skills.slice(0, 2).join(' and ') || 'software development';
  const topInterestStr = profile.interests[0] || 'emerging technology';

  const oppTargetEdu = opp.education_level.includes('undergraduate') || opp.education_level.includes('university')
    ? 'university students'
    : 'builders';

  const summarySentence = `You are a ${studentType} with ${topSkillStr} experience and an interest in ${topInterestStr}. This opportunity accepts ${oppTargetEdu} from ${profile.country || 'Nigeria'} and is looking for ${opp.skills[0] || 'talented'} developers interested in ${opp.field.split('&')[0].trim()}.`;

  return {
    matchPercentage: boundedMatchPercentage,
    summarySentence,
    whyYouMatch: Array.from(new Set(whyYouMatch)).slice(0, 4),
    potentialGaps: Array.from(new Set(potentialGaps)).slice(0, 2),
    scoreBreakdown: {
      skills: skillsScore,
      education: educationScore,
      location: locationScore,
      careerLevel: careerLevelScore,
      interest: interestScore,
    },
  };
}

export function calculateCommunityRecommendation(
  profile: UserProfile,
  community: Community
): CommunityRecommendation {
  let score = 65;
  const whyReasons: string[] = [];

  const userCountry = (profile.country || 'Nigeria').toLowerCase();
  const commCountries = community.countries.map((c) => c.toLowerCase());
  if (commCountries.includes(userCountry) || commCountries.includes('africa') || commCountries.includes('global')) {
    score += 15;
    whyReasons.push(`Active chapter and localized network in ${profile.country || 'Nigeria'}`);
  }

  const userSkills = profile.skills.map((s) => s.toLowerCase());
  const commSkills = community.skills.map((s) => s.toLowerCase());
  const commonSkills = commSkills.filter((cs) => userSkills.some((us) => us.includes(cs) || cs.includes(us)));

  if (commonSkills.length > 0) {
    score += 10;
    whyReasons.push(`Supports learning and projects in ${commonSkills.slice(0, 2).join(' & ')}`);
  }

  const userInterests = profile.interests.map((i) => i.toLowerCase());
  const focusMatches = community.focus_areas.filter((fa) =>
    userInterests.some((ui) => fa.toLowerCase().includes(ui) || ui.includes(fa.toLowerCase()))
  );

  if (focusMatches.length > 0) {
    score += 10;
    whyReasons.push(`Strong focus on ${focusMatches[0]}`);
  }

  if (community.members_type.includes(profile.career_level)) {
    whyReasons.push(`Dedicated initiatives specifically for ${profile.career_level}s`);
  }

  const boundedScore = Math.min(95, Math.max(68, score));
  const whyRecommend = whyReasons.slice(0, 2).join(' • ') || 'Offers active cohorts, mentorship, and opportunity feeds for emerging African tech talent.';

  return {
    community,
    matchPercentage: boundedScore,
    whyRecommend,
  };
}
