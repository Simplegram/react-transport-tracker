import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Platform,
    ViewStyle,
    TextStyle,
    type StyleProp, // Import StyleProp
} from 'react-native';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
// import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Optional: for proper safe area handling

const { height: screenHeight } = Dimensions.get('window');

// --- Constants ---
// These can be made configurable via props later if needed
const HEADER_MAX_HEIGHT = screenHeight * 0.33; // Initial height of the large info area
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 60; // Height of the collapsed header
const SCROLL_THRESHOLD = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT; // Scroll distance to trigger full collapse

const PADDING_HORIZONTAL = 20; // Default horizontal padding

const SNAP_DELAY_MS = 500; // Delay before snapping occurs after scroll end

// --- Props Definition ---
interface CollapsibleHeaderPageProps {
    largeHeaderText: string; // Text for the large header initially visible
    smallHeaderText: string; // Text for the small header visible when collapsed
    children: React.ReactNode; // The main content to be displayed below the header
    // Optional style props for customization
    containerStyle?: StyleProp<ViewStyle>;
    scrollViewStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>; // Applied to the ScrollView's contentContainerStyle
    smallHeaderContainerStyle?: StyleProp<ViewStyle>;
    smallHeaderTextStyle?: StyleProp<TextStyle>;
    largeInfoTextContainerStyle?: StyleProp<ViewStyle>;
    largeInfoTextStyle?: StyleProp<TextStyle>;
    // Add more style props if specific elements need deep customization
}

const CollapsibleHeaderPage: React.FC<CollapsibleHeaderPageProps> = ({
    largeHeaderText,
    smallHeaderText,
    children,
    containerStyle,
    scrollViewStyle,
    contentContainerStyle,
    smallHeaderContainerStyle,
    smallHeaderTextStyle,
    largeInfoTextContainerStyle,
    largeInfoTextStyle,
}) => {
    // Animated value to track scroll position
    const scrollY = useRef(new Animated.Value(0)).current;

    // Ref for the ScrollView instance to call methods like scrollTo
    const scrollViewRef = useRef<ScrollView>(null);

    const snapTimer = useRef<NodeJS.Timeout | null>(null); // Use NodeJS.Timeout for RN environment


    // --- Cleanup timer on unmount ---
    useEffect(() => {
        return () => {
            // Clear the timer if the component unmounts before the timeout finishes
            if (snapTimer.current) {
                clearTimeout(snapTimer.current);
            }
        };
    }, []);

    const scrollW = useSharedValue(0)
    const isScrolling = useSharedValue(false)
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            scrollW.value = event.contentOffset.y
            console.log(scrollW.value)
        },
        onBeginDrag: () => {
            isScrolling.value = true
        },
        onEndDrag: () => {
            isScrolling.value = false
        }
    })

    // --- Animation Interpolations ---

    // Opacity for the large info text (fades out as we scroll down)
    const largeInfoTextOpacity = scrollY.interpolate({
        inputRange: [0, SCROLL_THRESHOLD * 0.6, SCROLL_THRESHOLD],
        outputRange: [1, 0.3, 0], // Start fading early
        extrapolate: 'clamp',
    });

    // Opacity for the small collapsed header title (fades in as we scroll down)
    const smallHeaderOpacity = scrollY.interpolate({
        inputRange: [0, SCROLL_THRESHOLD * 0.6, SCROLL_THRESHOLD],
        outputRange: [0, 0.3, 1], // Fade in as large text fades out
        extrapolate: 'clamp',
    });

    // // --- Scroll Handlers ---
    // const handleScroll = Animated.event(
    //     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    //     { useNativeDriver: true } // Use native driver for performance (opacity works well)
    // );

    const snapToPosition = (offsetY: number) => {
        // Clear the timer just before snapping, in case it wasn't cleared elsewhere
        if (snapTimer.current) {
            clearTimeout(snapTimer.current);
            snapTimer.current = null; // Important: set ref back to null
        }
        scrollViewRef.current?.scrollTo({
            y: offsetY,
            animated: true, // Animate the scroll
        });
    }

    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;

        // Clear any existing timer before setting a new one
        if (snapTimer.current) {
            clearTimeout(snapTimer.current);
            snapTimer.current = null;
        }

        // If the scroll position is between 0 and the threshold, schedule the snap
        // Use a small epsilon (e.g., 0.1) to avoid floating point issues right at the boundary
        if (currentScrollY > 0.1 && currentScrollY < SCROLL_THRESHOLD - 0.1) {
            // Set a new timer
            snapTimer.current = setTimeout(() => {
                snapToPosition(SCROLL_THRESHOLD);
                // Determine which position is closer and snap to it
                // if (currentScrollY < SCROLL_THRESHOLD / 2) {
                //     // Closer to the top (0), show large header
                //     snapToPosition(0);
                // } else {
                //     // Closer to the collapsed state (SCROLL_THRESHOLD), snap input to top
                //     snapToPosition(SCROLL_THRESHOLD);
                // }
                snapTimer.current = null; // Clear the ref after execution
            }, SNAP_DELAY_MS);
        }
        // If scrollY is 0 or >= SCROLL_THRESHOLD, we are already at a snap point,
        // so no timer is needed or cleared here if it didn't exist in the intermediate range.
    };


    return (
        <View style={[styles.container, containerStyle]}>
            <Animated.View
                style={[
                    styles.smallHeaderContainer,
                    // Optional: Adjust top based on safe area if using useSafeAreaInsets
                    // { paddingTop: insets.top, height: adjustedHeaderMinHeight },
                    { opacity: smallHeaderOpacity }, // Apply opacity animation
                    smallHeaderContainerStyle, // Apply custom styles
                ]}
                pointerEvents="none" // Allows touches to pass through to the scroll view below
            >
                <View style={styles.smallHeaderContent}>
                    <Text style={[styles.smallHeaderText, smallHeaderTextStyle]}>
                        {smallHeaderText}
                    </Text>
                </View>
            </Animated.View>

            <Animated.ScrollView
                ref={scrollViewRef} // Attach the ref here
                style={[styles.scrollView, scrollViewStyle]}
                contentContainerStyle={[
                    {
                        paddingBottom: 20, // Add some padding at the bottom
                    },
                    contentContainerStyle, // Apply custom content container styles
                ]}
                onScroll={scrollHandler}
                scrollEventThrottle={16} // Capture scroll events frequently
                // onScrollEndDrag={handleScrollEnd} // Handle snap when user lifts finger
                // onMomentumScrollEnd={handleScrollEnd} // Handle snap when inertia scroll stops
            >
                <Animated.View
                    style={[
                        styles.largeInfoTextContainer,
                        { opacity: largeInfoTextOpacity },
                        largeInfoTextContainerStyle,
                    ]}
                    pointerEvents="none"
                >
                    <Text style={[styles.largeInfoText, largeInfoTextStyle]}>
                        {largeHeaderText}
                    </Text>
                </Animated.View>

                <View style={[styles.scrollContentInner]}>
                    {children}
                </View>

            </Animated.ScrollView>
        </View>
    );
};

// --- Styles for the base component structure ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Default background color
    },
    scrollView: {
        flex: 1,
        // No padding here, use contentContainerStyle instead
    },
    // This inner view provides padding for the children content
    scrollContentInner: {
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: 18, // Adjust spacing from the area above
    },
    smallHeaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_MIN_HEIGHT, // Matches the final height of the collapsed header area
        backgroundColor: '#fff', // Should match the background or be slightly different
        justifyContent: 'flex-end', // Align content to the bottom
        alignItems: 'flex-start', // Align content to the left
        zIndex: 2, // Ensure it's above everything else
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    // This provides the actual padding for the text within the small header container
    smallHeaderContent: {
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingBottom: Platform.OS === 'ios' ? 10 : 15, // Adjust padding to align text nicely
    },
    smallHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000', // Default text color
    },
    largeInfoTextContainer: {
        top: 0, // Align to the top of the content container
        left: 0,
        right: 0,
        height: HEADER_MAX_HEIGHT, // Give it a height roughly matching the padded area
        justifyContent: 'center', // Vertically center the text
        alignItems: 'center', // Horizontally center the text container
        paddingHorizontal: PADDING_HORIZONTAL, // Add padding for the text
        zIndex: 1, // Ensure it's below the fixed small header but above the scrollable content
    },
    largeInfoText: {
        fontSize: 26, // Large font size for prominent info
        fontWeight: 'bold',
        color: '#000', // Default text color
        textAlign: 'center', // Center the text itself
    },

    // content style removed - apply padding/margins directly to children or wrap children in a View with padding/margins.
    // The scrollContentInner View above serves as the container for children.
});

export default CollapsibleHeaderPage;