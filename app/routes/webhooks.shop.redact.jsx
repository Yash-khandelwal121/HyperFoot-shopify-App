import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received compliance webhook ${topic} for ${shop}`);

  // This webhook is triggered 48 hours after a store uninstalls the app.
  // We clean up sessions on uninstalled, so here we just return 200 OK.
  return new Response();
};
