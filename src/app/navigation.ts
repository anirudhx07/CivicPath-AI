import { AppScreen } from "../types";

/**
 * Screens where the navigation chrome (sidebar, header, bottom nav) should be hidden.
 */
export const ONBOARDING_SCREENS: readonly AppScreen[] = [
  AppScreen.SPLASH,
  AppScreen.LANGUAGE,
  AppScreen.ONBOARDING,
  AppScreen.ROLE_SELECTION,
  AppScreen.SIGN_IN,
] as const;

/**
 * Returns true if navigation chrome should be visible for the given screen.
 */
export function shouldShowNav(screen: AppScreen): boolean {
  return !ONBOARDING_SCREENS.includes(screen);
}
