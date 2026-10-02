/**
 * SINGLE SOURCE OF TRUTH for every image in the app.
 * Drop each file at the path in the require() below (see assets/ASSETS_TODO.md).
 * Different file name/extension? Change ONLY that one require line.
 * Run `npm run check:assets` to see which files are still missing.
 */
export const images = {
  brand: {
    logo: require('../../assets/images/brand/logo.png'),
    logoWordmark: require('../../assets/images/brand/logo_wordmark.png'),
  },
  onboarding: {
    heroRoom: require('../../assets/images/onboarding/image.png'),
    phoneInHand: require('../../assets/images/onboarding/phone_in_hand.png'),
    taglineCapture: require('../../assets/images/onboarding/tagline_capture.png'),
  },
  auth: {
    plantBottom: require('../../assets/images/auth/plant_bottom.png'),
    roomSoft: require('../../assets/images/auth/room_soft.png'),
    roomBed: require('../../assets/images/auth/room_bed.png'),
  },
  decor: {
    leavesTop: require('../../assets/images/decor/leaves_top.png'),
    leavesBottom: require('../../assets/images/decor/leaves_bottom.png'),
  },
} as const;
