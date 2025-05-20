import { collapsibleHeaderStyles } from '@/src/styles/Styles';
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
    return (
        <View style={[collapsibleHeaderStyles.container, containerStyle]}>
            <ScrollView contentContainerStyle={collapsibleHeaderStyles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                <View style={collapsibleHeaderStyles.fillerContainer}>
                    <Text style={collapsibleHeaderStyles.headerText}>{headerText}</Text>
                </View>
                {children}
            </ScrollView>
        </View>
    );
};