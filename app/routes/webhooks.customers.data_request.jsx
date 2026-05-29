import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received compliance webhook ${topic} for ${shop}`);

  // This webhook is triggered when a customer requests their data from the store owner.
  // Since this app does not store any customer personal data, we just return 200 OK.
  return new Response();
};
