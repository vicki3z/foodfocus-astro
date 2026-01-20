export const CONTENT_ROUTES = {
  'whats-in': { type: 'category', query: 'posts', label: "What's In" },
  'news': { type: 'category', query: 'posts', label: 'News' },
  'ushare': { type: 'category', query: 'posts', label: 'Ushare' },
  'roadmap': { type: 'cpt', query: 'roadmaps', label: 'Roadmap' },
  'roadshow': { type: 'cpt', query: 'roadshows', label: 'Roadshow' },
  'seminar': { type: 'cpt', query: 'seminars', label: 'Seminar' },
  'proseries': { type: 'cpt', query: 'proseries', label: 'Proseries' },
} as const;

export type ContentRouteKey = keyof typeof CONTENT_ROUTES;
export type ContentRoute = (typeof CONTENT_ROUTES)[ContentRouteKey];
