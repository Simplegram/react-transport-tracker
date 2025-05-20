import {
    View,
    StyleSheet,
    ViewStyle,
    TextStyle,
    type StyleProp,
    ScrollView,
    Dimensions,
    Text
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

// --- Props Definition ---
interface CollapsibleHeaderPageProps {
    headerText?: string;
    children: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
}

export default function CollapsibleHeaderPage({ 
    headerText, 
    children, 
    containerStyle 
}: CollapsibleHeaderPageProps) {
    return (
        <View style={[styles.container, containerStyle]}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                <View style={styles.fillerContainer}>
                    <Text style={styles.headerText}>{headerText}</Text>
                </View>
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
        minHeight: screenHeight * 0.45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 10
    },
    scrollContainer: {
        flexGrow: 1,
    }
});