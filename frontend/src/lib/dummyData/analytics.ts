// Analytics data types and interfaces

export interface AnalyticsData {
  totalContent: number;
  successRate: number;
  totalLanguages: number;
  weeklyUsage: number;
  weeklyChange: number;
  contentByType: Array<{ _id: string; count: number }>;
  contentByLanguage: Array<{ _id: string; count: number }>;
  weeklyTrend: Array<{ date: string; count: number }>;
}

// Export empty objects that will be populated by the API
export const dummyAnalyticsData: AnalyticsData = {
  totalContent: 0,
  successRate: 0,
  totalLanguages: 0,
  weeklyUsage: 0,
  weeklyChange: 0,
  contentByType: [],
  contentByLanguage: [],
  weeklyTrend: []
};

export const dummyInsights = {
  topPerformingContent: [],
  audienceDemographics: {},
  contentPerformance: {}
};
