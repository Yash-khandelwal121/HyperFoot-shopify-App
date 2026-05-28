import { Outlet, useLoaderData, useRouteError, useLocation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import "../styles/premium-footers.css";

export const loader = async ({ request }) => {
  try {
    await authenticate.admin(request);
  } catch (err) {
    // Re-throw Shopify auth redirects (they are Response objects)
    if (err instanceof Response) throw err;
    console.error("[app.jsx loader] Auth error:", err);
    // Fall through — AppProvider still renders with empty key
  }

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();
  const location = useLocation();

  const isFullscreenPreview = location.pathname.includes("/app/templates/");

  return (
    <AppProvider embedded apiKey={apiKey}>
      {!isFullscreenPreview && (
        <s-app-nav>
          <s-link href="/app">Dashboard</s-link>
          <s-link href="/app/pricing">Pricing</s-link>
          <s-link href="/app/settings">Settings</s-link>
          <s-link href="/app/additional">Labs</s-link>
        </s-app-nav>
      )}
      <div 
        className="footerverse-app-wrapper" 
        style={isFullscreenPreview ? {
          padding: 0,
          margin: 0,
          minHeight: '100vh',
          background: '#ffffff',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        } : {
          padding: '24px 0 0',
          minHeight: '100vh',
          background: '#f6f7f9',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        }}
      >
        <Outlet />
      </div>
    </AppProvider>
  );
}


// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
