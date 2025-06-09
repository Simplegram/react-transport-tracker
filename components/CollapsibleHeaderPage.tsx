import { useTheme } from '@/context/ThemeContext'
import {
    Dimensions,
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
    const { theme, getTheme } = useTheme()
    const newTheme = getTheme()

    const { height: screenHeight } = Dimensions.get('window')

    return (
        <View style={[
            {
                flex: 1,
                paddingTop: 5,
                paddingHorizontal: 15,

                backgroundColor: newTheme.palette.background,
            },
            containerStyle
        ]}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 20,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}
            >
                <View style={{
                    height: screenHeight * 0.43,
                    justifyContent: 'flex-end',
                }}>
                    <Text style={{
                        fontSize: 32,
                        fontWeight: 'bold',
                        paddingBottom: 15,

                        color: newTheme.palette.textBlack,
                    }}>{headerText}</Text>
                </View>
                <View style={{
                    flexGrow: 1,
                    overflow: 'hidden',
                }}>
                    {children}
                </View>
            </ScrollView>
        </View>
    )
}