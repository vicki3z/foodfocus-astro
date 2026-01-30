import { gql } from "@urql/core";

// Magazine Query - Get latest FFT magazine
export const GET_LATEST_MAGAZINE = gql`
  query GetLatestMagazine {
    magazineType(id: "fft", idType: SLUG) {
      magazines(first: 1) {
        nodes {
          title
          date
          magazines {
            image {
              node {
                sourceUrl
                altText
              }
            }
            link
            magazineNo
          }
        }
      }
    }
  }
`;

// Get all Magazine Types (taxonomies)
export const GET_MAGAZINE_TYPES = gql`
  query GetMagazineTypes {
    magazineTypes {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

// Get Magazines by Type Query (taxonomy-based like roadshows)
export const GET_MAGAZINES_BY_TYPE = gql`
  query GetMagazinesByType($typeSlug: ID!) {
    magazineType(id: $typeSlug, idType: SLUG) {
      name
      slug
      magazines(first: 200) {
        nodes {
          title
          date
          magazines {
            image {
              node {
                sourceUrl
                altText
              }
            }
            link
            magazineNo
          }
        }
      }
    }
  }
`;

// Legacy: Get all Magazines Query (for backwards compatibility)
export const GET_ALL_MAGAZINES = gql`
  query GetAllMagazines($first: Int!, $after: String) {
    magazines(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        date
        magazineTypes {
          nodes {
            slug
            name
          }
        }
        magazines {
          image {
            node {
              sourceUrl
              altText
            }
          }
          link
          magazineNo
        }
      }
    }
  }
`;

// Get Page by Slug Query
export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

// Banners Query
export const GET_BANNERS = gql`
  query GetBanners {
    banners(first: 100) {
      nodes {
        title
        bannerFields {
          image {
            node {
              sourceUrl
              altText
            }
          }
          link
        }
      }
    }
  }
`;

export const GET_TOP_BANNERS = gql`
  query GetTopBanners {
    positions(where: { name: "Top"}) {
      nodes {
        name
        banners {
          nodes {
            title
            bannerFields {
              image {
                node {
                  sourceUrl
                  altText
                }
              }
              link
            }

          }
        }
      }
    }
  }
`;

export const GET_BOTTOM_BANNERS = gql`
  query GetBottomBanners {
    positions(where: { name: "Bottom"}) {
      nodes {
        name
        banners {
          nodes {
            title
            bannerFields {
              image {
                node {
                  sourceUrl
                  altText
                }
              }
              link
            }

          }
        }
      }
    }
  }
`;

// Posts by Category Query
export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($first: Int!, $after: String, $category: String!) {
    posts(first: $first, after: $after, where: { categoryName: $category }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        excerpt
        date
        slug
        link
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

// Single Post Query
export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
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
`;

// Event Years Query
export const GET_EVENT_YEARS = gql`
  query GetEventYears {
    eventYears(first: 100) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

// Roadmaps Query by Year Taxonomy
export const GET_ROADMAPS = gql`
  query GetRoadmaps($yearSlug: ID!) {
    eventYear(id: $yearSlug, idType: SLUG) {
      name
      roadmaps(first: 50) {
        nodes {
          title
          slug
          link
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
        }
      }
    }
  }
`;

export const GET_LATEST_EVENTS = gql`
  query GetLatestEvents($yearSlug: ID!) {
    eventYear(id: $yearSlug, idType: SLUG) {
      roadmaps(first: 3) {
        nodes {
          title
          slug
          link
          date
        }
      }
      roadshows(first: 3) {
        nodes {
          title
          slug
          link
          date
        }
      }
      proseries(first: 3) {
        nodes {
          title
          slug
          link
          date
        }
      }
      seminars(first: 3) {
        nodes {
          title
          slug
          link
          date
        }
      }
    }
  }
`

// Roadshows Query by Year Taxonomy
export const GET_ROADSHOWS = gql`
  query GetRoadshows($yearSlug: ID!) {
    eventYear(id: $yearSlug, idType: SLUG) {
      name
      roadshows(first: 50) {
        nodes {
          title
          slug
          link
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
        }
      }
    }
  }
`;

// Seminars Query by Year Taxonomy
export const GET_SEMINARS = gql`
  query GetSeminars($yearSlug: ID!) {
    eventYear(id: $yearSlug, idType: SLUG) {
      name
      seminars(first: 50) {
        nodes {
          title
          slug
          link
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
        }
      }
    }
  }
`;

// Proseries Query by Year Taxonomy
export const GET_PROSERIES = gql`
  query GetProseries($yearSlug: ID!) {
    eventYear(id: $yearSlug, idType: SLUG) {
      name
      proseries(first: 50) {
        nodes {
          title
          slug
          link
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
        }
      }
    }
  }
`;

// Get all Proseries (for getStaticPaths)
export const GET_ALL_PROSERIES = gql`
  query GetAllProseries($first: Int!, $after: String) {
    proseries(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        content
        slug
        link
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
        eventsMetadata {
          homepage
        }
      }
    }
  }
`;

// Get all Roadmaps (for getStaticPaths)
export const GET_ALL_ROADMAPS = gql`
  query GetAllRoadmaps($first: Int, $after: String) {
    roadmaps(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        content
        slug
        link
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
        eventsMetadata {
          homepage
        }
      }
    }
  }
`;

// Get all Roadshows (for getStaticPaths)
export const GET_ALL_ROADSHOWS = gql`
  query GetAllRoadshows($first: Int!, $after: String) {
    roadshows(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        content
        slug
        link
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
        eventsMetadata {
          homepage
        }
      }
    }
  }
`;

// Get all Seminars (for getStaticPaths)
export const GET_ALL_SEMINARS = gql`
  query GetAllSeminars($first: Int!, $after: String) {
    seminars(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        content
        slug
        link
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
        eventsMetadata {
          homepage
        }
      }
    }
  }
`;

// Single Roadmap Query
export const GET_ROADMAP_BY_SLUG = gql`
  query GetRoadmapBySlug($slug: ID!) {
    roadmap(id: $slug, idType: SLUG) {
      title
      content
      slug
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
`;

// Single Roadshow Query
export const GET_ROADSHOW_BY_SLUG = gql`
  query GetRoadshowBySlug($slug: ID!) {
    roadshow(id: $slug, idType: SLUG) {
      title
      content
      slug
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
`;

// Single Seminar Query
export const GET_SEMINAR_BY_SLUG = gql`
  query GetSeminarBySlug($slug: ID!) {
    seminar(id: $slug, idType: SLUG) {
      title
      content
      slug
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
`;

// Single Proseries Query
export const GET_PROSERIES_BY_SLUG = gql`
  query GetProseriesBySlug($slug: ID!) {
    proserie(id: $slug, idType: SLUG) {
      title
      content
      slug
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
`;

// Exhibition Page Query
export const GET_EXHIBITION_PAGE = gql`
  query GetExhibitionPage($slug: ID!) {
    page(id: $slug, idType: URI) {
      title
      content
    }
  }
`;

// Media Partners Query
export const GET_MEDIA_PARTNERS = gql`
  query GetMediaPartners {
    mediaPartners(first: 100) {
      nodes {
        title
        bannerFields {
          image {
            node {
              sourceUrl
              altText
            }
          }
          link
        }
      }
    }
  }
`;

// Exhibitions Query - Placeholder (will be updated when correct GraphQL field is known)
// For now, this will return empty data which is handled gracefully by the page
export const GET_EXHIBITIONS = gql`
  query GetExhibitions($yearSlug: ID!) {
    eventYear(id: $yearSlug, idType: SLUG) {
      name
    }
  }
`;

export const GET_HOMEPAGE_HIGHLIGHTS = gql`
  query GetHomepageHighlights {
    categories(first: 4, where: { name: "homepage" }) {
      nodes {
        posts {
          nodes {
            title
            excerpt
            date
            slug
            link
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
    }
  }
`

export const GET_HOMEPAGE_ROADMAPS = gql`
  query GetHomepageRoadmaps {
    roadmaps(where: { homepage: "true"}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        slug
        link
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
        eventsMetadata {
          homepagePosition
        }
      }
    }
  }
`;

export const GET_HOMEPAGE_ROADSHOWS = gql`
  query GetHomepageRoadshows {
    roadshows(where: { homepage: "true"}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        slug
        link
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
        eventsMetadata {
          homepagePosition
        }
      }
    }
  }
`;

export const GET_HOMEPAGE_PROSERIES = gql`
  query GetHomepageProseries {
    proseries(where: { homepage: "true"}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        slug
        link
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
        eventsMetadata {
          homepagePosition
        }
      }
    }
  }
`;

export const GET_HOMEPAGE_SEMINARS = gql`
  query GetHomepageSeminars {
    seminars(where: { homepage: "true"}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        slug
        link
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
        eventsMetadata {
          homepagePosition
        }
      }
    }
  }
`;

export const GET_EVENTS_BY_YEAR_AND_MONTH = gql`
  query GetEventsByYearAndMonth($year: String!, $month: String!) {
    events(first: 10, where: {year: $year, month: $month}) {
      nodes {
        eventsGroupField {
          fullEventName
          location
          dateStart
          dateEnd
          website
          tel
          email
          year
          month
        }
      }
    }
  }
`
