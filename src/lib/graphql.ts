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
