// ─── Visa & Locale Types ────────────────────────────────────────────────────

export type VisaType = "O-1" | "H-1B" | "EB-2-NIW" | "F-1" | "L-1" | "E-2" | "B1/B2" | "eb1a" | "eb2perm" | "eb1c" | "tn" | "eb3" | "j1";

export type ConfidenceLevel = "high" | "medium" | "low" | "not_applicable";

export type Locale = "en" | "es";

// ─── Quiz Answer Types ──────────────────────────────────────────────────────

export type ImmigrationIntent =
  | "tourism"
  | "study"
  | "work_specialty"
  | "business_investment"
  | "green_card"
  | "not_sure";

export type GreenCardPathway =
  | "extraordinary_ability"
  | "employer_sponsorship"
  | "investment"
  | "family"
  | "not_sure";

export type AgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55+";

export type EducationLevel =
  | "none"
  | "high_school"
  | "bachelors"
  | "masters"
  | "phd"
  | "other";

export type EmploymentType = "employee" | "freelance" | "founder" | "unemployed";

export type IncomeRange =
  | "<30k"
  | "30k-60k"
  | "60k-100k"
  | "100k-200k"
  | "200k+";

export type InvestmentCapital =
  | "<50k"
  | "50k-100k"
  | "100k-500k"
  | "500k+";

export type DesiredTimeline = "asap" | "6months" | "1year" | "2plus" | "exploring";

export type LongTermGoal =
  | "temporary_visit"
  | "multi_year_stay"
  | "permanent_residency"
  | "citizenship_path";

export type TravelHistory = "extensive" | "moderate" | "limited" | "none";

export type DocumentsReady = "diploma" | "transcripts" | "none";

export type PublicationsCount = "1-3" | "4-10" | "10+";

// ─── Quiz Answers ───────────────────────────────────────────────────────────

export interface QuizAnswers {
  // Step 0: Intent
  intent: ImmigrationIntent;

  // Step 0b: Green card pathway (conditional)
  greenCardPathway?: GreenCardPathway;

  // Step 1: Basic profile
  nationality: string;
  countryOfResidence: string;
  ageRange: AgeRange;

  // Step 2: Education
  educationLevel: EducationLevel;
  degreeField?: string;
  degreeCountry?: string;
  professionMatchesDegree?: "yes" | "somewhat" | "no";
  documentsReady: DocumentsReady[];

  // Step 3: Professional background
  profession: string;
  yearsExperience: number;
  employmentType: EmploymentType;
  isFounder: boolean;
  hasManagementExperience: boolean;
  incomeRange: IncomeRange;
  notableClients?: string;

  // Step 4: Recognition & achievements
  hasPublications: boolean;
  publicationsCount?: PublicationsCount;
  hasSpeakingEngagements: boolean;
  hasAwards: boolean;
  hasMediaCoverage: boolean;
  hasCertifications: boolean;
  hasMemberships?: boolean;
  hasJudgingExperience?: boolean;
  hasPortfolio?: boolean;
  patents?: boolean;                        // EB-1A: patents filed or granted
  recognitionBeyondEmployer?: boolean;      // EB-1A: recognition outside current employer/local area

  // Step 5: U.S. connection
  priorUsVisits: number;
  priorUsVisaType?: string;
  hasOverstay: boolean;
  hasDenial: boolean;
  hasUsSponsor: boolean;                    // legacy: any sponsor (permanent OR temporary)
  permanentJobSponsor?: boolean;            // EB-2 PERM: employer willing to sponsor green card
  temporaryJobSponsor?: boolean;            // H-1B/L-1: employer willing to sponsor temp visa
  hasUsBusinessPartner?: boolean;
  hasFamilyInUs?: boolean;
  hasUniversityAcceptance?: boolean;
  investmentCapitalAvailable?: InvestmentCapital;

  // Step 6: Immigration goals
  desiredTimeline?: DesiredTimeline;
  preferredState?: string;
  longTermGoal: LongTermGoal;

  // Step 7: Dependents (conditional)
  hasDependents?: boolean;
  dependentCount?: number;
  dependentAges?: number[];

  // Step 8: Home ties (B1/B2 path only)
  hasEmploymentHomeTies?: boolean;
  isCurrentlyStudying?: boolean;
  hasPropertyHomeTies?: boolean;
  hasVehicleOrBusiness?: boolean;
  isMarried?: boolean;
  priorTravelHistory?: TravelHistory;
  plansToReturn?: boolean;
}

// ─── Scoring Types ──────────────────────────────────────────────────────────

export interface VisaScoringFactor {
  factor: string;
  weight: number;
  score: number;
  label: string;
  present: boolean;
}

export interface VisaResult {
  visaType: VisaType;
  totalScore: number;
  confidence: ConfidenceLevel;
  meetsMinimumThreshold: boolean;
  lotteryRisk?: boolean;
  ageOutWarning?: boolean;
  dualIntentRisk?: boolean;
  l1AEligible?: boolean;
  contextualNotice?: string;               // soft informational message shown on result card
  eb1cSubpath?: "l1a_to_eb1c" | "e2_to_eb1c" | "direct"; // EB-1C strategic subpath
  tnOccupation?: string;                   // TN: matched USMCA Appendix 2 profession (if any)
  tnOccupationConfidence?: "high" | "medium" | "none"; // TN: occupation mapping confidence
  eb3Subcategory?: "eb3a" | "eb3b" | "eb3c" | null;   // EB-3: professionals / skilled / other workers
  isScheduleA?: boolean;                   // EB-3: Schedule A (nurses/PTs) — skips PERM
  j1Subcategory?: string;                  // J-1: detected exchange program subcategory
  twoYearRiskLevel?: "none" | "possible" | "likely" | "certain"; // J-1: 212(e) home residency risk
  factors: VisaScoringFactor[];
  strengths: string[];
  weaknesses: string[];
  riskFactors: string[];
  nextSteps: string[];
  recommendedEvidence: string[];
  processingTimeMonths: [number, number];
  estimatedCostUsd: [number, number];
}

export interface AnalysisResponse {
  sessionId: string;
  topResults: VisaResult[];
  allResults: VisaResult[];
  generatedAt: string;
}

// ─── Quiz State ─────────────────────────────────────────────────────────────

export interface QuizState {
  currentStep: number;
  answers: Partial<QuizAnswers>;
  sessionToken: string;
  locale: Locale;
  completedSteps: number[];
  isSubmitting: boolean;
  navDirection: "forward" | "backward";
}

export type QuizAction =
  | { type: "SET_ANSWER"; key: keyof QuizAnswers; value: QuizAnswers[keyof QuizAnswers] }
  | { type: "SET_ANSWERS"; answers: Partial<QuizAnswers> }
  | { type: "NEXT_STEP"; nextStep: number }
  | { type: "PREV_STEP"; prevStep: number }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "RESET" };

// ─── Lead Capture ────────────────────────────────────────────────────────────

export interface LeadSubmission {
  email: string;
  name?: string;
  whatsapp?: string;
  locale: Locale;
  sessionId?: string;
  attorneyInterest?: boolean;
  utmSource?: string;
}

// ─── SEO Types ───────────────────────────────────────────────────────────────

export interface SeoSlug {
  slug: string;
  visaType: VisaType;
  profession?: string;
  country?: string;
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  relatedSlugs: string[];
}

export interface SeoFaqItem {
  questionEn: string;
  questionEs: string;
  answerEn: string;
  answerEs: string;
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface QuestionCardProps {
  step: number;
  totalSteps: number;
  question: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  note?: string;
}

export interface OptionButtonProps {
  value: string;
  label: string;
  description?: string;
  selected?: boolean;
  onClick: (value: string) => void;
  multiSelect?: boolean;
}

export interface ResultCardProps {
  visa: VisaResult;
  rank: 1 | 2 | 3;
  shareable?: boolean;
  locale: string;
  defaultExpanded?: boolean;
}

export interface VisaScoreBadgeProps {
  score: number;
  confidence: ConfidenceLevel;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export interface DisclaimerBannerProps {
  variant?: "inline" | "sticky" | "modal";
  locale?: string;
}
