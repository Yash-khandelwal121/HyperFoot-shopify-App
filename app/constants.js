export const PLAN_FREE     = "Free";
export const PLAN_STARTER  = "Starter Plan";
export const PLAN_BUSINESS = "Business Plan";
export const PLAN_PREMIUM  = "Premium Plan";

/**
 * Returns true if the given plan has access to the given templateId.
 * Access is CUMULATIVE — higher plans include all lower-tier templates.
 *
 * Free     → template 1
 * Starter  → templates 1, 2, 3
 * Business → templates 1, 2, 3, 4, 5
 * Premium  → templates 1–7 (all)
 */
export function checkPlanAccess(plan, templateId) {
  const tId = String(templateId);
  const p    = String(plan).toLowerCase();

  // Template 1 is always free
  if (tId === "1") return true;

  // Premium unlocks everything
  if (p.includes("premium"))  return true;

  // Business unlocks 1-5
  if (p.includes("business")) return ["2", "3", "4", "5"].includes(tId);

  // Starter unlocks 1-3
  if (p.includes("starter"))  return ["2", "3"].includes(tId);

  // Free — only template 1 (already handled above)
  return false;
}

/**
 * Returns the human-readable label for a plan key.
 */
export function getPlanLabel(plan) {
  const p = String(plan).toLowerCase();
  if (p.includes("premium"))  return "Premium Plan";
  if (p.includes("business")) return "Business Plan";
  if (p.includes("starter"))  return "Starter Plan";
  return "Free";
}

/**
 * Returns how many templates a given plan unlocks.
 */
export function unlockedCount(plan) {
  const p = String(plan).toLowerCase();
  if (p.includes("premium"))  return 7;
  if (p.includes("business")) return 5;
  if (p.includes("starter"))  return 3;
  return 1;
}
