import { normalizeContentUrls } from "./utils";

export type BannerPosition = "Top" | "Bottom";

export interface Banner {
  title: string;
  image: string;
  imageAlt?: string;
  link?: string;
}

/**
 * Plain string (NOT gql tagged) because it runs client-side via fetch.
 * Sent as GET so the browser can reuse WordPress's cache-control headers.
 */
const BANNERS_BY_POSITION_QUERY = `
  query GetBannersByPosition($position: [String]) {
    positions(where: { name: $position }) {
      nodes {
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

function mapBanners(data: any): Banner[] {
  const bannerNodes = data?.positions?.nodes?.[0]?.banners?.nodes || [];
  return bannerNodes.map((banner: any) => ({
    title: banner.title,
    image: normalizeContentUrls(banner.bannerFields?.image?.node?.sourceUrl || ""),
    imageAlt: banner.bannerFields?.image?.node?.altText || "",
    link: banner.bannerFields?.link || "",
  }));
}

export async function fetchBannersByPosition(
  graphqlUrl: string,
  position: BannerPosition,
): Promise<Banner[]> {
  const searchParams = new URLSearchParams({
    query: BANNERS_BY_POSITION_QUERY,
    variables: JSON.stringify({ position: [position] }),
  });
  const response = await fetch(`${graphqlUrl}?${searchParams}`);

  if (!response.ok) {
    throw new Error(`${position} banners request failed: ${response.status}`);
  }

  const json = await response.json();
  return mapBanners(json.data);
}
