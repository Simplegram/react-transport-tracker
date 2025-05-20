import { useTheme } from '@/context/ThemeContext';
import { collapsibleHeaderStyles, styles } from '@/src/styles/Styles';
import {
    View,
    ViewStyle,
    type StyleProp,
    ScrollView,
    Text
} from 'react-native';

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
    const { theme } = useTheme()
    let activeTheme = theme

    return (
        <View style={[collapsibleHeaderStyles[activeTheme].container, containerStyle]}>
            <ScrollView
                contentContainerStyle={collapsibleHeaderStyles[activeTheme].scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}
            >
                <View style={collapsibleHeaderStyles[activeTheme].fillerContainer}>
                    <Text style={collapsibleHeaderStyles[activeTheme].headerText}>{headerText}</Text>
                </View>
                {children}
            </ScrollView>
        </View>
    );
};