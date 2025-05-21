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

    return (
        <View style={[collapsibleHeaderStyles[theme].container, containerStyle]}>
            <ScrollView
                contentContainerStyle={collapsibleHeaderStyles[theme].scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}
            >
                <View style={collapsibleHeaderStyles[theme].fillerContainer}>
                    <Text style={collapsibleHeaderStyles[theme].headerText}>{headerText}</Text>
                </View>
                {children}
            </ScrollView>
        </View>
    );
};