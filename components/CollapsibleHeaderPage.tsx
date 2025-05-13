import {
    View,
    StyleSheet,
    ViewStyle,
    TextStyle,
    type StyleProp,
    ScrollView,
    Dimensions
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

// --- Props Definition ---
interface CollapsibleHeaderPageProps {
    largeHeaderText?: string; // Text for the large header initially visible
    smallHeaderText?: string; // Text for the small header visible when collapsed (optional, not used in current layout but kept)
    children: React.ReactNode; // The main content to be displayed below the header
    containerStyle?: StyleProp<ViewStyle>;
    scrollViewStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>; // Applied to the ScrollView's contentContainerStyle
    smallHeaderContainerStyle?: StyleProp<ViewStyle>; // Not used in current layout but kept
    smallHeaderTextStyle?: StyleProp<TextStyle>; // Not used in current layout but kept
    largeInfoTextContainerStyle?: StyleProp<ViewStyle>;
    largeInfoTextStyle?: StyleProp<TextStyle>;
}

const CollapsibleHeaderPage: React.FC<CollapsibleHeaderPageProps> = ({ // Not used in the current layout structure
    children,
    containerStyle,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                <View style={styles.fillerContainer}></View>
                {children}
            </ScrollView>
        </View>
    );
};

// --- Styles for the base component structure ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    fillerContainer: {
        flex: 1,
        minHeight: screenHeight * 0.45
    },
    scrollContainer: {
        flexGrow: 1,
        // padding: 15,
        // borderRadius: 20,
    }
});

export default CollapsibleHeaderPage;