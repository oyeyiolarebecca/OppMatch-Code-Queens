import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_PROFILE } from '../data/seedData';
import {
  CVReviewReport,
  LinkedInReviewReport,
  PipelineStage,
  TrackedApplication,
  UserProfile,
} from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (fullName: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loadDemoUser: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  // Opportunity Tracking & Pipeline
  trackedApplications: Record<string, TrackedApplication>;
  updateOpportunityStage: (opportunityId: string, stage: PipelineStage, notes?: string) => void;
  isOpportunitySaved: (opportunityId: string) => boolean;
  toggleSaveOpportunity: (opportunityId: string) => void;
  removeOpportunityTracking: (opportunityId: string) => void;
  // Reviews
  cvReports: CVReviewReport[];
  saveCVReport: (report: CVReviewReport) => void;
  unlockCVReport: (reportId: string) => void;
  linkedInReports: LinkedInReviewReport[];
  saveLinkedInReport: (report: LinkedInReviewReport) => void;
  unlockLinkedInReport: (reportId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'oppmatch_auth_user';
const STORAGE_KEY_IS_DEMO = 'oppmatch_is_demo';
const STORAGE_KEY_TRACKED = 'oppmatch_tracked_apps';
const STORAGE_KEY_CV = 'oppmatch_cv_reports';
const STORAGE_KEY_LINKEDIN = 'oppmatch_linkedin_reports';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trackedApplications, setTrackedApplications] = useState<Record<string, TrackedApplication>>({});
  const [cvReports, setCvReports] = useState<CVReviewReport[]>([]);
  const [linkedInReports, setLinkedInReports] = useState<LinkedInReviewReport[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      const storedIsDemo = localStorage.getItem(STORAGE_KEY_IS_DEMO) === 'true';
      const storedTracked = localStorage.getItem(STORAGE_KEY_TRACKED);
      const storedCv = localStorage.getItem(STORAGE_KEY_CV);
      const storedLi = localStorage.getItem(STORAGE_KEY_LINKEDIN);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsDemoMode(storedIsDemo);
      }

      if (storedTracked) {
        setTrackedApplications(JSON.parse(storedTracked));
      } else {
        // Initialize default demo tracked applications
        const initialTracked: Record<string, TrackedApplication> = {
          'opp-wetech-nexascale-hackathon': {
            opportunityId: 'opp-wetech-nexascale-hackathon',
            stage: 'preparing',
            notes: 'Working on UI prototype and problem statement presentation.',
            dateAdded: '2026-09-12',
            lastUpdated: '2026-09-18',
          },
          'opp-shecodeafrica-mentorship': {
            opportunityId: 'opp-shecodeafrica-mentorship',
            stage: 'applied',
            notes: 'Submitted motivation essay and GitHub portfolio link.',
            dateAdded: '2026-09-08',
            lastUpdated: '2026-09-14',
          },
        };
        setTrackedApplications(initialTracked);
        localStorage.setItem(STORAGE_KEY_TRACKED, JSON.stringify(initialTracked));
      }

      if (storedCv) {
        setCvReports(JSON.parse(storedCv));
      }

      if (storedLi) {
        setLinkedInReports(JSON.parse(storedLi));
      }
    } catch (e) {
      console.error('Failed reading auth storage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _pass: string) => {
    setIsLoading(true);
    // Simulate lightweight auth verification
    await new Promise((r) => setTimeout(r, 450));

    // If matches demo or any email, log in or restore user
    const loggedUser: UserProfile = {
      ...DEMO_PROFILE,
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      email: email,
      full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
    };

    setUser(loggedUser);
    setIsDemoMode(false);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loggedUser));
    localStorage.setItem(STORAGE_KEY_IS_DEMO, 'false');
    setIsLoading(false);
    return { success: true };
  };

  const signUp = async (fullName: string, email: string, _pass: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 450));

    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      full_name: fullName,
      email: email,
      location: 'Lagos, Nigeria',
      country: 'Nigeria',
      education: 'undergraduate',
      school: 'University of Lagos',
      career_level: 'student',
      skills: ['React', 'JavaScript', 'HTML/CSS'],
      interests: ['Artificial Intelligence', 'Web Development', 'Social Impact'],
      preferred_categories: ['hackathon', 'scholarship', 'internship'],
      remote_preference: 'both',
      experience: 'Computer Science undergraduate student passionate about web and AI technologies.',
      goals: 'Discover matching opportunities, prepare competitive applications, and close skill gaps.',
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    setIsDemoMode(false);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEY_IS_DEMO, 'false');
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_IS_DEMO);
  };

  const loadDemoUser = () => {
    setUser(DEMO_PROFILE);
    setIsDemoMode(true);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_PROFILE));
    localStorage.setItem(STORAGE_KEY_IS_DEMO, 'true');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated, updated_at: new Date().toISOString() };
    setUser(newProfile);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newProfile));
  };

  const updateOpportunityStage = (
    opportunityId: string,
    stage: PipelineStage,
    notes?: string
  ) => {
    setTrackedApplications((prev) => {
      const existing = prev[opportunityId];
      const updated: TrackedApplication = {
        opportunityId,
        stage,
        notes: notes !== undefined ? notes : existing ? existing.notes : '',
        dateAdded: existing ? existing.dateAdded : new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      const next = { ...prev, [opportunityId]: updated };
      localStorage.setItem(STORAGE_KEY_TRACKED, JSON.stringify(next));
      return next;
    });
  };

  const isOpportunitySaved = (opportunityId: string) => {
    return !!trackedApplications[opportunityId];
  };

  const toggleSaveOpportunity = (opportunityId: string) => {
    setTrackedApplications((prev) => {
      const next = { ...prev };
      if (next[opportunityId]) {
        delete next[opportunityId];
      } else {
        next[opportunityId] = {
          opportunityId,
          stage: 'saved',
          notes: 'Saved to my OppMatch pipeline.',
          dateAdded: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      localStorage.setItem(STORAGE_KEY_TRACKED, JSON.stringify(next));
      return next;
    });
  };

  const removeOpportunityTracking = (opportunityId: string) => {
    setTrackedApplications((prev) => {
      const next = { ...prev };
      delete next[opportunityId];
      localStorage.setItem(STORAGE_KEY_TRACKED, JSON.stringify(next));
      return next;
    });
  };

  const saveCVReport = (report: CVReviewReport) => {
    setCvReports((prev) => {
      const filtered = prev.filter((r) => r.id !== report.id);
      const next = [report, ...filtered];
      localStorage.setItem(STORAGE_KEY_CV, JSON.stringify(next));
      return next;
    });
  };

  const unlockCVReport = (reportId: string) => {
    setCvReports((prev) => {
      const next = prev.map((r) => (r.id === reportId ? { ...r, isUnlocked: true } : r));
      localStorage.setItem(STORAGE_KEY_CV, JSON.stringify(next));
      return next;
    });
  };

  const saveLinkedInReport = (report: LinkedInReviewReport) => {
    setLinkedInReports((prev) => {
      const filtered = prev.filter((r) => r.id !== report.id);
      const next = [report, ...filtered];
      localStorage.setItem(STORAGE_KEY_LINKEDIN, JSON.stringify(next));
      return next;
    });
  };

  const unlockLinkedInReport = (reportId: string) => {
    setLinkedInReports((prev) => {
      const next = prev.map((r) => (r.id === reportId ? { ...r, isUnlocked: true } : r));
      localStorage.setItem(STORAGE_KEY_LINKEDIN, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isDemoMode,
        login,
        signUp,
        logout,
        loadDemoUser,
        updateProfile,
        trackedApplications,
        updateOpportunityStage,
        isOpportunitySaved,
        toggleSaveOpportunity,
        removeOpportunityTracking,
        cvReports,
        saveCVReport,
        unlockCVReport,
        linkedInReports,
        saveLinkedInReport,
        unlockLinkedInReport,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
