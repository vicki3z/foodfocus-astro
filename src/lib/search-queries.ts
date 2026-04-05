/**
 * GraphQL queries for client-side search.
 * These are plain string constants (NOT gql tagged) because they run
 * client-side via fetch, not through the urql client.
 */

export const SEARCH_POSTS = `
  query SearchPosts($search: String!, $categoryName: String!, $first: Int!) {
    posts(first: $first, where: { search: $search, categoryName: $categoryName }) {
      nodes {
        title
        excerpt
        date
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const SEARCH_ROADMAPS = `
  query SearchRoadmaps($search: String!, $first: Int!) {
    roadmaps(first: $first, where: { search: $search }) {
      nodes {
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        postSummary {
          summary
        }
        eventYears {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const SEARCH_ROADSHOWS = `
  query SearchRoadshows($search: String!, $first: Int!) {
    roadshows(first: $first, where: { search: $search }) {
      nodes {
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        postSummary {
          summary
        }
        eventYears {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const SEARCH_PROSERIES = `
  query SearchProseries($search: String!, $first: Int!) {
    proseries(first: $first, where: { search: $search }) {
      nodes {
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        postSummary {
          summary
        }
        eventYears {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const SEARCH_SEMINARS = `
  query SearchSeminars($search: String!, $first: Int!) {
    seminars(first: $first, where: { search: $search }) {
      nodes {
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        postSummary {
          summary
        }
        eventYears {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;
