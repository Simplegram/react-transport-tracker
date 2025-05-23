import { useTheme } from '@/context/ThemeContext'
import { collapsibleHeaderStyles } from '@/src/styles/Styles'
import {
    ScrollView,
    Text,
    View,
    ViewStyle,
    type StyleProp
} from 'react-native'

interface CollapsibleHeaderPageProps {
    headerText?: string
    children: React.ReactNode
    containerStyle?: StyleProp<ViewStyle>
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
    )
}