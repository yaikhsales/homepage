import { useState, useEffect } from 'react';

// Breakpoint definitions (matching Tailwind CSS defaults and extended)
export const breakpoints = {
    // Extra small devices (phones, portrait)
    xs: 0,          // 0px - Small phones (iPhone SE, etc.)
    sm: 640,        // 640px - Large phones (iPhone, Android)
    md: 768,        // 768px - Tablets (iPad portrait, small tablets)
    lg: 1024,       // 1024px - Laptops (iPad landscape, small laptops)
    xl: 1280,       // 1280px - Desktops (standard laptops, desktops)
    '2xl': 1536,    // 1536px - Large screens (large desktops)
    '3xl': 1920,    // 1920px - Extra large screens (Full HD, large monitors)
    '4xl': 2560,    // 2560px - Ultra-wide screens (2K monitors)
    '5xl': 3840,    // 3840px - 4K screens (4K monitors, large displays)
    '6xl': 5120,    // 5120px - 5K screens (5K monitors, ultra-wide 4K)
};

// Additional device-specific breakpoints
export const deviceBreakpoints = {
    // Phones
    iphoneSE: 375,      // iPhone SE, iPhone 6/7/8
    iphoneXR: 414,      // iPhone XR, iPhone 11
    iphonePro: 390,     // iPhone 12/13/14 Pro
    iphoneProMax: 428,  // iPhone 12/13/14 Pro Max
    androidSmall: 360,  // Small Android phones
    androidMedium: 412, // Medium Android phones
    androidLarge: 480,  // Large Android phones
    
    // Tablets
    ipadMini: 768,      // iPad Mini (portrait)
    ipad: 810,          // iPad (portrait)
    ipadPro: 1024,      // iPad Pro (portrait)
    androidTablet: 800, // Android tablets
    
    // Laptops
    laptopSmall: 1024,  // Small laptops (13")
    laptopMedium: 1366, // Medium laptops (14-15")
    laptopLarge: 1440,  // Large laptops (15-17")
    
    // Desktops
    desktopHD: 1920,    // Full HD (1080p)
    desktop2K: 2560,    // 2K (1440p)
    desktop4K: 3840,    // 4K (2160p)
    desktop5K: 5120,    // 5K (2880p)
};

// Device type detection
export const deviceTypes = {
    SMALL_PHONE: 'small-phone',      // < 375px (iPhone SE, small Android)
    PHONE: 'phone',                   // 375px - 639px (iPhone, Android)
    LARGE_PHONE: 'large-phone',       // 640px - 767px (iPhone Pro Max, large Android)
    SMALL_TABLET: 'small-tablet',     // 768px - 1023px (iPad Mini, small tablets)
    TABLET: 'tablet',                 // 1024px - 1279px (iPad, tablets)
    LAPTOP: 'laptop',                 // 1280px - 1535px (Laptops, small desktops)
    DESKTOP: 'desktop',               // 1536px - 1919px (Desktops, standard monitors)
    LARGE_DESKTOP: 'large-desktop',   // 1920px - 2559px (Large monitors, Full HD)
    ULTRA_WIDE: 'ultra-wide',         // 2560px - 3839px (2K monitors, ultra-wide)
    '4K': '4k',                       // 3840px - 5119px (4K monitors, large displays)
    '5K': '5k',                       // 5120px+ (5K monitors, ultra-wide 4K)
};

// Device orientation
export const orientations = {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape',
};

// Get device orientation
export const getOrientation = (width, height) => {
    return width > height ? orientations.LANDSCAPE : orientations.PORTRAIT;
};

// Check if device supports touch
export const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Check if device is retina/high DPI
export const isRetina = () => {
    if (typeof window === 'undefined') return false;
    return window.devicePixelRatio > 1;
};

// Get device type based on width
export const getDeviceType = (width) => {
    if (width < 375) return deviceTypes.SMALL_PHONE;
    if (width < 640) return deviceTypes.PHONE;
    if (width < 768) return deviceTypes.LARGE_PHONE;
    if (width < 1024) return deviceTypes.SMALL_TABLET;
    if (width < 1280) return deviceTypes.TABLET;
    if (width < 1536) return deviceTypes.LAPTOP;
    if (width < 1920) return deviceTypes.DESKTOP;
    if (width < 2560) return deviceTypes.LARGE_DESKTOP;
    if (width < 3840) return deviceTypes.ULTRA_WIDE;
    if (width < 5120) return deviceTypes['4K'];
    return deviceTypes['5K'];
};

// Get device category (simplified)
export const getDeviceCategory = (width) => {
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    if (width < 1920) return 'desktop';
    return 'large-desktop';
};

// Check if device is mobile (phone or small tablet)
export const isMobile = (width) => {
    return width < 768;
};

// Check if device is tablet
export const isTablet = (width) => {
    return width >= 768 && width < 1024;
};

// Check if device is desktop/laptop
export const isDesktop = (width) => {
    return width >= 1024;
};

// Check if device is small screen
export const isSmallScreen = (width) => {
    return width < 640;
};

// Check if device is large screen
export const isLargeScreen = (width) => {
    return width >= 1920;
};

// React hook for window size
export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call once to get initial size

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

// React hook for device type
export const useDeviceType = () => {
    const { width } = useWindowSize();
    return getDeviceType(width);
};

// React hook for responsive breakpoint checks
export const useBreakpoint = (breakpoint) => {
    const { width } = useWindowSize();
    return width >= breakpoints[breakpoint];
};

// React hook for mobile detection
export const useIsMobile = () => {
    const { width } = useWindowSize();
    return isMobile(width);
};

// React hook for tablet detection
export const useIsTablet = () => {
    const { width } = useWindowSize();
    return isTablet(width);
};

// React hook for desktop detection
export const useIsDesktop = () => {
    const { width } = useWindowSize();
    return isDesktop(width);
};

// React hook for small screen detection
export const useIsSmallScreen = () => {
    const { width } = useWindowSize();
    return isSmallScreen(width);
};

// React hook for large screen detection
export const useIsLargeScreen = () => {
    const { width } = useWindowSize();
    return isLargeScreen(width);
};

// React hook for device orientation
export const useOrientation = () => {
    const { width, height } = useWindowSize();
    return getOrientation(width, height);
};

// React hook for touch device detection
export const useIsTouchDevice = () => {
    const [isTouch, setIsTouch] = useState(false);
    
    useEffect(() => {
        setIsTouch(isTouchDevice());
    }, []);
    
    return isTouch;
};

// React hook for retina/high DPI detection
export const useIsRetina = () => {
    const [isRetinaDisplay, setIsRetinaDisplay] = useState(false);
    
    useEffect(() => {
        setIsRetinaDisplay(isRetina());
    }, []);
    
    return isRetinaDisplay;
};

// React hook for device category
export const useDeviceCategory = () => {
    const { width } = useWindowSize();
    return getDeviceCategory(width);
};

// Get responsive classes based on device type
export const getResponsiveClasses = (deviceType, classes) => {
    const classMap = {
        [deviceTypes.SMALL_PHONE]: classes.smallPhone || classes.phone || '',
        [deviceTypes.PHONE]: classes.phone || '',
        [deviceTypes.LARGE_PHONE]: classes.largePhone || classes.phone || '',
        [deviceTypes.SMALL_TABLET]: classes.smallTablet || classes.tablet || '',
        [deviceTypes.TABLET]: classes.tablet || '',
        [deviceTypes.LAPTOP]: classes.laptop || classes.desktop || '',
        [deviceTypes.DESKTOP]: classes.desktop || '',
        [deviceTypes.LARGE_DESKTOP]: classes.largeDesktop || classes.desktop || '',
        [deviceTypes.ULTRA_WIDE]: classes.ultraWide || classes.largeDesktop || '',
        [deviceTypes['4K']]: classes['4k'] || classes.ultraWide || '',
        [deviceTypes['5K']]: classes['5k'] || classes['4k'] || '',
    };
    return classMap[deviceType] || classes.default || '';
};

// Responsive grid columns based on device type
export const getResponsiveGridCols = (deviceType) => {
    const gridMap = {
        [deviceTypes.SMALL_PHONE]: 1,
        [deviceTypes.PHONE]: 1,
        [deviceTypes.LARGE_PHONE]: 2,
        [deviceTypes.SMALL_TABLET]: 2,
        [deviceTypes.TABLET]: 3,
        [deviceTypes.LAPTOP]: 4,
        [deviceTypes.DESKTOP]: 5,
        [deviceTypes.LARGE_DESKTOP]: 6,
        [deviceTypes.ULTRA_WIDE]: 7,
        [deviceTypes['4K']]: 8,
        [deviceTypes['5K']]: 10,
    };
    return gridMap[deviceType] || 4;
};

// Responsive grid columns for specific use cases
export const getResponsiveGridColsForCards = (deviceType) => {
    const gridMap = {
        [deviceTypes.SMALL_PHONE]: 1,
        [deviceTypes.PHONE]: 2,
        [deviceTypes.LARGE_PHONE]: 2,
        [deviceTypes.SMALL_TABLET]: 3,
        [deviceTypes.TABLET]: 4,
        [deviceTypes.LAPTOP]: 5,
        [deviceTypes.DESKTOP]: 6,
        [deviceTypes.LARGE_DESKTOP]: 7,
        [deviceTypes.ULTRA_WIDE]: 8,
        [deviceTypes['4K']]: 10,
        [deviceTypes['5K']]: 12,
    };
    return gridMap[deviceType] || 4;
};

// Responsive font sizes based on device type
export const getResponsiveFontSize = (deviceType, baseSize = 'base') => {
    const sizeMap = {
        [deviceTypes.SMALL_PHONE]: 'text-xs',
        [deviceTypes.PHONE]: 'text-sm',
        [deviceTypes.LARGE_PHONE]: 'text-base',
        [deviceTypes.SMALL_TABLET]: 'text-base',
        [deviceTypes.TABLET]: 'text-lg',
        [deviceTypes.LAPTOP]: 'text-lg',
        [deviceTypes.DESKTOP]: 'text-xl',
        [deviceTypes.LARGE_DESKTOP]: 'text-xl',
        [deviceTypes.ULTRA_WIDE]: 'text-2xl',
        [deviceTypes['4K']]: 'text-3xl',
        [deviceTypes['5K']]: 'text-4xl',
    };
    return sizeMap[deviceType] || 'text-base';
};

// Get responsive font size with custom scale
export const getResponsiveFontSizeScaled = (deviceType, scale = 1) => {
    const baseSizes = {
        [deviceTypes.SMALL_PHONE]: 12,
        [deviceTypes.PHONE]: 14,
        [deviceTypes.LARGE_PHONE]: 16,
        [deviceTypes.SMALL_TABLET]: 16,
        [deviceTypes.TABLET]: 18,
        [deviceTypes.LAPTOP]: 18,
        [deviceTypes.DESKTOP]: 20,
        [deviceTypes.LARGE_DESKTOP]: 20,
        [deviceTypes.ULTRA_WIDE]: 24,
        [deviceTypes['4K']]: 30,
        [deviceTypes['5K']]: 36,
    };
    const baseSize = baseSizes[deviceType] || 16;
    return `${baseSize * scale}px`;
};

// Responsive padding based on device type
export const getResponsivePadding = (deviceType) => {
    const paddingMap = {
        [deviceTypes.SMALL_PHONE]: 'p-2',
        [deviceTypes.PHONE]: 'p-3',
        [deviceTypes.LARGE_PHONE]: 'p-4',
        [deviceTypes.SMALL_TABLET]: 'p-4',
        [deviceTypes.TABLET]: 'p-5',
        [deviceTypes.LAPTOP]: 'p-6',
        [deviceTypes.DESKTOP]: 'p-6',
        [deviceTypes.LARGE_DESKTOP]: 'p-8',
        [deviceTypes.ULTRA_WIDE]: 'p-10',
        [deviceTypes['4K']]: 'p-12',
        [deviceTypes['5K']]: 'p-16',
    };
    return paddingMap[deviceType] || 'p-4';
};

// Responsive gap based on device type
export const getResponsiveGap = (deviceType) => {
    const gapMap = {
        [deviceTypes.SMALL_PHONE]: 'gap-1',
        [deviceTypes.PHONE]: 'gap-2',
        [deviceTypes.LARGE_PHONE]: 'gap-3',
        [deviceTypes.SMALL_TABLET]: 'gap-3',
        [deviceTypes.TABLET]: 'gap-4',
        [deviceTypes.LAPTOP]: 'gap-4',
        [deviceTypes.DESKTOP]: 'gap-6',
        [deviceTypes.LARGE_DESKTOP]: 'gap-8',
        [deviceTypes.ULTRA_WIDE]: 'gap-10',
        [deviceTypes['4K']]: 'gap-12',
        [deviceTypes['5K']]: 'gap-16',
    };
    return gapMap[deviceType] || 'gap-4';
};

// Responsive container max width
export const getResponsiveMaxWidth = (deviceType) => {
    const maxWidthMap = {
        [deviceTypes.SMALL_PHONE]: 'max-w-full',
        [deviceTypes.PHONE]: 'max-w-full',
        [deviceTypes.LARGE_PHONE]: 'max-w-full',
        [deviceTypes.SMALL_TABLET]: 'max-w-2xl',
        [deviceTypes.TABLET]: 'max-w-4xl',
        [deviceTypes.LAPTOP]: 'max-w-6xl',
        [deviceTypes.DESKTOP]: 'max-w-7xl',
        [deviceTypes.LARGE_DESKTOP]: 'max-w-[90rem]',
        [deviceTypes.ULTRA_WIDE]: 'max-w-[120rem]',
        [deviceTypes['4K']]: 'max-w-[160rem]',
        [deviceTypes['5K']]: 'max-w-[200rem]',
    };
    return maxWidthMap[deviceType] || 'max-w-7xl';
};

// Media query helper function
export const matchMedia = (query) => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
};

// Create media query string
export const createMediaQuery = (minWidth, maxWidth = null) => {
    if (maxWidth) {
        return `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`;
    }
    return `(min-width: ${minWidth}px)`;
};

// Responsive image sizes based on device type
export const getResponsiveImageSize = (deviceType) => {
    const sizeMap = {
        [deviceTypes.SMALL_PHONE]: { width: 150, height: 150 },
        [deviceTypes.PHONE]: { width: 200, height: 200 },
        [deviceTypes.LARGE_PHONE]: { width: 250, height: 250 },
        [deviceTypes.SMALL_TABLET]: { width: 300, height: 300 },
        [deviceTypes.TABLET]: { width: 400, height: 400 },
        [deviceTypes.LAPTOP]: { width: 500, height: 500 },
        [deviceTypes.DESKTOP]: { width: 600, height: 600 },
        [deviceTypes.LARGE_DESKTOP]: { width: 700, height: 700 },
        [deviceTypes.ULTRA_WIDE]: { width: 800, height: 800 },
        [deviceTypes['4K']]: { width: 1000, height: 1000 },
        [deviceTypes['5K']]: { width: 1200, height: 1200 },
    };
    return sizeMap[deviceType] || { width: 400, height: 400 };
};

// Responsive card size based on device type
export const getResponsiveCardSize = (deviceType) => {
    const sizeMap = {
        [deviceTypes.SMALL_PHONE]: 'w-full h-24',
        [deviceTypes.PHONE]: 'w-full h-28',
        [deviceTypes.LARGE_PHONE]: 'w-full h-32',
        [deviceTypes.SMALL_TABLET]: 'w-48 h-40',
        [deviceTypes.TABLET]: 'w-56 h-44',
        [deviceTypes.LAPTOP]: 'w-64 h-48',
        [deviceTypes.DESKTOP]: 'w-72 h-52',
        [deviceTypes.LARGE_DESKTOP]: 'w-80 h-56',
        [deviceTypes.ULTRA_WIDE]: 'w-96 h-64',
        [deviceTypes['4K']]: 'w-[28rem] h-72',
    };
    return sizeMap[deviceType] || 'w-64 h-48';
};

// Responsive icon size based on device type
export const getResponsiveIconSize = (deviceType) => {
    const sizeMap = {
        [deviceTypes.SMALL_PHONE]: 16,
        [deviceTypes.PHONE]: 20,
        [deviceTypes.LARGE_PHONE]: 24,
        [deviceTypes.SMALL_TABLET]: 28,
        [deviceTypes.TABLET]: 32,
        [deviceTypes.LAPTOP]: 36,
        [deviceTypes.DESKTOP]: 40,
        [deviceTypes.LARGE_DESKTOP]: 44,
        [deviceTypes.ULTRA_WIDE]: 48,
        [deviceTypes['4K']]: 56,
        [deviceTypes['5K']]: 64,
    };
    return sizeMap[deviceType] || 32;
};

// Get responsive border radius
export const getResponsiveBorderRadius = (deviceType) => {
    const radiusMap = {
        [deviceTypes.SMALL_PHONE]: 'rounded-md',
        [deviceTypes.PHONE]: 'rounded-lg',
        [deviceTypes.LARGE_PHONE]: 'rounded-lg',
        [deviceTypes.SMALL_TABLET]: 'rounded-xl',
        [deviceTypes.TABLET]: 'rounded-xl',
        [deviceTypes.LAPTOP]: 'rounded-2xl',
        [deviceTypes.DESKTOP]: 'rounded-2xl',
        [deviceTypes.LARGE_DESKTOP]: 'rounded-3xl',
        [deviceTypes.ULTRA_WIDE]: 'rounded-3xl',
        [deviceTypes['4K']]: 'rounded-[2rem]',
        [deviceTypes['5K']]: 'rounded-[2.5rem]',
    };
    return radiusMap[deviceType] || 'rounded-lg';
};

// Get responsive shadow
export const getResponsiveShadow = (deviceType) => {
    const shadowMap = {
        [deviceTypes.SMALL_PHONE]: 'shadow-sm',
        [deviceTypes.PHONE]: 'shadow',
        [deviceTypes.LARGE_PHONE]: 'shadow-md',
        [deviceTypes.SMALL_TABLET]: 'shadow-md',
        [deviceTypes.TABLET]: 'shadow-lg',
        [deviceTypes.LAPTOP]: 'shadow-lg',
        [deviceTypes.DESKTOP]: 'shadow-xl',
        [deviceTypes.LARGE_DESKTOP]: 'shadow-2xl',
        [deviceTypes.ULTRA_WIDE]: 'shadow-2xl',
        [deviceTypes['4K']]: 'shadow-2xl',
        [deviceTypes['5K']]: 'shadow-2xl',
    };
    return shadowMap[deviceType] || 'shadow-md';
};

// Responsive text size classes (Tailwind CSS)
export const responsiveTextSizes = {
    smallPhone: {
        xs: 'text-[10px]',
        sm: 'text-xs',
        base: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
        '2xl': 'text-xl',
        '3xl': 'text-2xl',
    },
    phone: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
    },
    tablet: {
        xs: 'text-sm',
        sm: 'text-base',
        base: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
        '2xl': 'text-3xl',
        '3xl': 'text-4xl',
    },
    desktop: {
        xs: 'text-base',
        sm: 'text-lg',
        base: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-3xl',
        '2xl': 'text-4xl',
        '3xl': 'text-5xl',
    },
    largeDesktop: {
        xs: 'text-lg',
        sm: 'text-xl',
        base: 'text-2xl',
        lg: 'text-3xl',
        xl: 'text-4xl',
        '2xl': 'text-5xl',
        '3xl': 'text-6xl',
    },
};

// Responsive spacing classes
export const responsiveSpacing = {
    smallPhone: {
        p: 'p-2',
        px: 'px-2',
        py: 'py-2',
        m: 'm-2',
        mx: 'mx-2',
        my: 'my-2',
        gap: 'gap-2',
    },
    phone: {
        p: 'p-3',
        px: 'px-3',
        py: 'py-3',
        m: 'm-3',
        mx: 'mx-3',
        my: 'my-3',
        gap: 'gap-3',
    },
    tablet: {
        p: 'p-4',
        px: 'px-4',
        py: 'py-4',
        m: 'm-4',
        mx: 'mx-4',
        my: 'my-4',
        gap: 'gap-4',
    },
    desktop: {
        p: 'p-6',
        px: 'px-6',
        py: 'py-6',
        m: 'm-6',
        mx: 'mx-6',
        my: 'my-6',
        gap: 'gap-6',
    },
    largeDesktop: {
        p: 'p-8',
        px: 'px-8',
        py: 'py-8',
        m: 'm-8',
        mx: 'mx-8',
        my: 'my-8',
        gap: 'gap-8',
    },
};

// Get all responsive utilities for a device type
export const getResponsiveConfig = (deviceType) => {
    return {
        deviceType,
        gridCols: getResponsiveGridCols(deviceType),
        gridColsForCards: getResponsiveGridColsForCards(deviceType),
        fontSize: getResponsiveFontSize(deviceType),
        padding: getResponsivePadding(deviceType),
        gap: getResponsiveGap(deviceType),
        maxWidth: getResponsiveMaxWidth(deviceType),
        imageSize: getResponsiveImageSize(deviceType),
        cardSize: getResponsiveCardSize(deviceType),
        iconSize: getResponsiveIconSize(deviceType),
        borderRadius: getResponsiveBorderRadius(deviceType),
        shadow: getResponsiveShadow(deviceType),
        textSizes: responsiveTextSizes[deviceType] || responsiveTextSizes.phone,
        spacing: responsiveSpacing[deviceType] || responsiveSpacing.phone,
    };
};

// Export all utilities
export default {
    breakpoints,
    deviceBreakpoints,
    deviceTypes,
    orientations,
    getDeviceType,
    getDeviceCategory,
    getOrientation,
    isTouchDevice,
    isRetina,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,
    useWindowSize,
    useDeviceType,
    useDeviceCategory,
    useBreakpoint,
    useIsMobile,
    useIsTablet,
    useIsDesktop,
    useIsSmallScreen,
    useIsLargeScreen,
    useOrientation,
    useIsTouchDevice,
    useIsRetina,
    getResponsiveClasses,
    getResponsiveGridCols,
    getResponsiveGridColsForCards,
    getResponsiveFontSize,
    getResponsiveFontSizeScaled,
    getResponsivePadding,
    getResponsiveGap,
    getResponsiveMaxWidth,
    getResponsiveBorderRadius,
    getResponsiveShadow,
    matchMedia,
    createMediaQuery,
    getResponsiveImageSize,
    getResponsiveCardSize,
    getResponsiveIconSize,
    getResponsiveConfig,
    responsiveTextSizes,
    responsiveSpacing,
};

