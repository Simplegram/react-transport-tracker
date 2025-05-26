import { colors } from '@/const/color'
import { useTheme } from '@/context/ThemeContext'
import { darkenColor, getBackgroundColorFromStyle, getColorFromStyle } from '@/src/utils/colorsUtils'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

type Props = {
    title?: string
    onPress?: () => void
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    color?: string
    darkenAmount?: number
    children?: string
}

export default function Button({
    title,
    onPress,
    style,
    textStyle,
    color = '#f3f3f3',
    darkenAmount = 0.3,
    children,
}: Props) {
    const { theme } = useTheme()

    const buttonContainerStyle = ({ pressed }: { pressed: boolean }) => {
        const styleBackgroundColor = getBackgroundColorFromStyle(style)
        const baseBackgroundColor = styleBackgroundColor || color

        const backgroundColor = pressed ? darkenColor(baseBackgroundColor, darkenAmount) : baseBackgroundColor

        return [styles.buttonContainer, style, { backgroundColor }] as StyleProp<ViewStyle>
    }

    console.log(title)

    return (
        <Pressable style={buttonContainerStyle} onPress={onPress}>
            {({ pressed }) => {
                const styleTextColor = getColorFromStyle(textStyle)
                const baseTextColor = styleTextColor || styles.buttonText.color || theme === 'light' ? colors.white : colors.dimWhite

                const effectiveTextColor = (pressed && theme === 'dark') ? darkenColor(baseTextColor, darkenAmount) : baseTextColor

                return (
                    <Text style={[styles.buttonText, textStyle, { color: effectiveTextColor }]}>
                        {title ? title : children}
                    </Text>
                )
            }}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        maxHeight: 55,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})