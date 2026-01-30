import { createClient, cacheExchange, fetchExchange } from '@urql/core';
import type { DocumentInput } from '@urql/core';

const endpoint = import.meta.env.WP_GRAPHQL_URL;

const client = createClient({
  url: endpoint,
  exchanges: [cacheExchange, fetchExchange],
});

export async function fetchGraphQL<T>(
  query: DocumentInput,
  variables?: Record<string, unknown>
): Promise<T> {
  const result = await client.query(query, variables ?? {}).toPromise();

  if (result.error) {
    console.error('GraphQL fetch error:', result.error);
    throw result.error;
  }

  return result.data as T;
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
  query: DocumentInput,
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
