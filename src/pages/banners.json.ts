import type { APIRoute } from "astro";
import { fetchGraphQL } from "../lib/graphql";
import { GET_TOP_BANNERS } from "../lib/queries";

export const GET: APIRoute = async () => {
  const topBannersData = await fetchGraphQL<any>(GET_TOP_BANNERS).catch(
    () => null,
  );

  const items = (topBannersData?.positions?.nodes[0]?.banners?.nodes || []).map(
    (b: any) => ({
      title: b.title,
      image: b.bannerFields?.image?.node?.sourceUrl || "",
      imageAlt: b.bannerFields?.image?.node?.altText || "",
      link: b.bannerFields?.link || "",
    }),
  );

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};
