import { GraphQLClient } from 'graphql-request';

const endpoint = import.meta.env.WP_GRAPHQL_URL || 'https://foodfocusthailand.com/wp-cms/graphql';

export const client = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    return await client.request<T>(query, variables);
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    throw error;
  }
}

/**
 * Fetches all items from a paginated GraphQL query by looping through all pages.
 * Uses cursor-based pagination with hasNextPage and endCursor.
 *
 * @param query - The GraphQL query string
 * @param variables - Initial query variables (should include 'first' parameter)
 * @param getNodes - Function to extract nodes array from the response
 * @param getPageInfo - Function to extract pageInfo from the response
 * @returns Promise<any[]> - Array of all fetched nodes
 */
export async function fetchAllPaginated<T>(
  query: string,
  variables: Record<string, any>,
  getNodes: (data: T) => any[],
  getPageInfo: (data: T) => { hasNextPage: boolean; endCursor: string | null }
): Promise<any[]> {
  let allItems: any[] = [];
  let hasNextPage = true;
  let afterCursor: string | null = null;

  while (hasNextPage) {
    const data = await fetchGraphQL<T>(query, {
      ...variables,
      after: afterCursor,
    }).catch(() => null);

    if (!data) break;

    const nodes = getNodes(data);
    allItems = [...allItems, ...nodes];

    const pageInfo = getPageInfo(data);
    hasNextPage = pageInfo.hasNextPage;
    afterCursor = pageInfo.endCursor;
  }

  return allItems;
}
