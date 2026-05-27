import prisma from "./db.server";
import { defaultFooterSettings } from "./components/FooterRenderer";

/**
 * Get or create ShopSettings for a shop
 */
export async function getShopSettings(shop) {
  try {
    let settings = await prisma.shopSettings.findUnique({
      where: { shop }
    });

    if (!settings) {
      settings = await prisma.shopSettings.create({
        data: {
          shop,
          activePlan: 'Free',
          installedFooter: '1',
          settingsJson: JSON.stringify(defaultFooterSettings)
        }
      });
    }

    return {
      ...settings,
      parsedSettings: JSON.parse(settings.settingsJson)
    };
  } catch (error) {
    console.error("Error in getShopSettings:", error);
    return {
      shop,
      activePlan: 'Free',
      installedFooter: '1',
      settingsJson: JSON.stringify(defaultFooterSettings),
      parsedSettings: defaultFooterSettings
    };
  }
}

/**
 * Update ShopSettings in SQLite
 */
export async function updateShopSettings(shop, data) {
  try {
    const updated = await prisma.shopSettings.upsert({
      where: { shop },
      update: data,
      create: {
        shop,
        activePlan: data.activePlan || 'Free',
        installedFooter: data.installedFooter || '1',
        settingsJson: data.settingsJson || JSON.stringify(defaultFooterSettings)
      }
    });

    return updated;
  } catch (error) {
    console.error("Error in updateShopSettings:", error);
    throw error;
  }
}

/**
 * Synchronize settings with Shopify Shop Metafields
 */
export async function syncSettingsToShopify(admin, shop, settingsData) {
  try {
    // 1. Fetch Shop GID
    const shopQuery = await admin.graphql(`
      query {
        shop {
          id
        }
      }
    `);
    const shopResponse = await shopQuery.json();
    const shopId = shopResponse.data?.shop?.id;

    if (!shopId) {
      throw new Error("Could not fetch Shop GID from Shopify Admin API");
    }

    // 2. Set metafield
    const metafieldMutation = await admin.graphql(
      `#graphql
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafields: [
            {
              ownerId: shopId,
              namespace: "footerverse",
              key: "settings",
              value: JSON.stringify(settingsData),
              type: "json"
            }
          ]
        }
      }
    );

    const mutationResult = await metafieldMutation.json();
    const errors = mutationResult.data?.metafieldsSet?.userErrors;

    if (errors && errors.length > 0) {
      console.error("Shopify metafield save error:", errors);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in syncSettingsToShopify:", error);
    return false;
  }
}

