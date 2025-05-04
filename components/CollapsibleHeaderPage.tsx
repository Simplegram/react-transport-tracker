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
// import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Optional: for proper safe area handling

const { height: screenHeight } = Dimensions.get('window');

// --- Constants ---
const HEADER_MAX_HEIGHT = screenHeight * 0.45; // Initial height of the large info area
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 0 : 0; // Height of the collapsed header
const SCROLL_THRESHOLD = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT; // Scroll distance to trigger full collapse
const MAIN_SCROLLVIEW_HEIGHT = screenHeight + HEADER_MAX_HEIGHT * 0.32
const BOTTOM_SCROLL_THRESHOLD = MAIN_SCROLLVIEW_HEIGHT * 0.14

const PADDING_HORIZONTAL = 20; // Default horizontal padding

const SNAP_DELAY_MS = 250; // Delay before snapping occurs after scroll end

// --- Props Definition ---
interface CollapsibleHeaderPageProps {
    largeHeaderText: string; // Text for the large header initially visible
    smallHeaderText?: string; // Text for the small header visible when collapsed (optional, not used in current layout but kept)
    children: React.ReactNode; // The main content to be displayed below the header
    // Optional style props for customization
    containerStyle?: StyleProp<ViewStyle>;
    scrollViewStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>; // Applied to the ScrollView's contentContainerStyle
    smallHeaderContainerStyle?: StyleProp<ViewStyle>; // Not used in current layout but kept
    smallHeaderTextStyle?: StyleProp<TextStyle>; // Not used in current layout but kept
    largeInfoTextContainerStyle?: StyleProp<ViewStyle>;
    largeInfoTextStyle?: StyleProp<TextStyle>;
    // Add more style props if specific elements need deep customization
}

const CollapsibleHeaderPage: React.FC<CollapsibleHeaderPageProps> = ({
    largeHeaderText,
    smallHeaderText, // Not used in the current layout structure
    children,
    containerStyle,
    scrollViewStyle,
    contentContainerStyle,
    smallHeaderContainerStyle, // Not used in the current layout structure
    smallHeaderTextStyle, // Not used in the current layout structure
    largeInfoTextContainerStyle,
    largeInfoTextStyle,
}) => {
    // Animated value to track scroll position
    const scrollY = useRef(new Animated.Value(0)).current;

    // State to control the scrollability of the inner ScrollView
    const [outerScroll, setOuterScroll] = useState<number>()
    const [isInnerScrollEnabled, setIsInnerScrollEnabled] = useState(false);

    // Ref for the ScrollView instance to call methods like scrollTo
    const outerScrollViewRef = useRef<ScrollView>(null);
    const innerScrollViewRef = useRef<ScrollView>(null); // Ref for the inner ScrollView

    const snapTimer = useRef<NodeJS.Timeout | null>(null);

    // --- Cleanup timer on unmount ---
    useEffect(() => {
        return () => {
            if (snapTimer.current) {
                clearTimeout(snapTimer.current);
            }
        };
    }, []);

    const smallHeaderOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT * 0.3],
        outputRange: [0, 1], // Fade in as large text fades out
        extrapolate: 'clamp',
    });

    const largeInfoTextOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT * 0.3],
        outputRange: [1, 0], // Start fading early
        extrapolate: 'clamp',
    });

    const largeInfoTextTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT],
        outputRange: [HEADER_MAX_HEIGHT, 0], // Move up by the threshold distance
        extrapolate: 'clamp',
    });

    // --- Scroll Handlers ---

    const handleOuterScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false, // Set to true if only animating compatible props (opacity, transform), false otherwise.
                                     // Here, we also need to read y for state, so true might be problematic if y is not available instantly.
                                     // Let's keep false for simplicity as we are reading y in the listener anyway.
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const currentScrollY = event.nativeEvent.contentOffset.y;
                setOuterScroll(currentScrollY)
            },
        }
    );

    // Handle snap behavior on scroll end for the *outer* ScrollView
    const handleOuterScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        setOuterScroll(currentScrollY)

        if (snapTimer.current) {
            clearTimeout(snapTimer.current);
            snapTimer.current = null;
        }

        if (currentScrollY >= BOTTOM_SCROLL_THRESHOLD) {
            setIsInnerScrollEnabled(true)
        } 
        else if (currentScrollY < BOTTOM_SCROLL_THRESHOLD) {
            setIsInnerScrollEnabled(false)
        }
    };

    const handleInnerScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
       const currentOuterScrollY = outerScroll ?? 0;

        if (currentOuterScrollY >= BOTTOM_SCROLL_THRESHOLD) {
            setIsInnerScrollEnabled(true)
        } 
        else if (currentOuterScrollY < BOTTOM_SCROLL_THRESHOLD) {
            setIsInnerScrollEnabled(false)
        }
    };


    return (
        <View style={[styles.container, containerStyle]}>
            <Animated.View
                style={[
                    styles.smallHeaderContainer,
                    { opacity: smallHeaderOpacity },
                    smallHeaderContainerStyle,
                ]}
                pointerEvents="none"
            >
                <View style={styles.smallHeaderContent}>
                    <Text style={[styles.smallHeaderText, smallHeaderTextStyle]}>
                        {smallHeaderText}
                    </Text>
                </View>
            </Animated.View>

            <Animated.ScrollView
                ref={outerScrollViewRef} // Attach the ref here
                style={[styles.scrollView, scrollViewStyle]}
                contentContainerStyle={[
                    { 
                        height: MAIN_SCROLLVIEW_HEIGHT 
                    },
                    contentContainerStyle,
                ]}
                onScroll={handleOuterScroll}
                scrollEventThrottle={8}
                onScrollEndDrag={handleOuterScrollEnd}
                onMomentumScrollEnd={handleOuterScrollEnd}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
            >
                 <Animated.View
                    style={[
                        styles.largeInfoTextContainer,
                        {
                            top: 0,
                            left: 0,
                            right: 0,
                            height: largeInfoTextTranslateY,
                            opacity: largeInfoTextOpacity,
                        },
                        largeInfoTextContainerStyle,
                    ]}
                    pointerEvents="auto"
                >
                    <Text style={[styles.largeInfoText, largeInfoTextStyle]}>
                        {largeHeaderText}
                    </Text>
                </Animated.View>


                <View style={[styles.scrollContentInner, { height: screenHeight }]}>
                    <ScrollView
                        ref={innerScrollViewRef}
                        scrollEnabled={isInnerScrollEnabled}
                        nestedScrollEnabled={true}
                        onScrollEndDrag={handleInnerScrollEnd}
                        onMomentumScrollEnd={handleInnerScrollEnd}
                        keyboardShouldPersistTaps="always"
                    >
                        {children}
                    </ScrollView>
                </View>

            </Animated.ScrollView>
        </View>
    );
};

// --- Styles for the base component structure ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    largeInfoTextContainer: {
        // This container's position and transform are handled by animation styles
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: PADDING_HORIZONTAL,
        zIndex: 1, // Below the fixed small header (if present), above the content
        backgroundColor: 'transparent', // Ensure it doesn't block the view if needed
    },
    largeInfoText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
     // This inner view provides padding and contains the inner ScrollView
    scrollContentInner: {
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingBottom: 20,
        // paddingTop: 18,
        flex: 1, // Ensure it takes available space within the outer ScrollView's content container
    },
     // --- Styles for optional fixed small header (if re-added) ---
    smallHeaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_MIN_HEIGHT,
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        zIndex: 2,
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
    smallHeaderContent: {
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingBottom: Platform.OS === 'ios' ? 10 : 15,
    },
    smallHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default CollapsibleHeaderPage;