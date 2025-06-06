import { useTheme } from '@/context/ThemeContext'
import { colors } from '@/src/const/color'
import { darkenColor, getBackgroundColorFromStyle, getColorFromStyle } from '@/src/utils/colorUtils'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export interface Props {
    disabled?: boolean
    label?: string
    onPress?: () => void
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    color?: string
    darkenAmount?: number
    children?: string | React.ReactNode
}

export default function Button({
    disabled,
    label,
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

    return (
        <Pressable disabled={disabled} style={buttonContainerStyle} onPress={onPress}>
            {({ pressed }) => {
                const styleTextColor = getColorFromStyle(textStyle)
                const baseTextColor = styleTextColor || styles.buttonText.color || (theme === 'light' ? colors.white : colors.white_100)

                const effectiveTextColor = (pressed && theme === 'dark') ? darkenColor(baseTextColor, darkenAmount) : baseTextColor

                return (
                    <Text style={[styles.buttonText, textStyle, { color: effectiveTextColor }]}>
                        {label ? label : children}
                    </Text>
                )
            }}
        </Pressable>
    )
}

function AddButton(props: Props) {
    const { style, textStyle, ...restProps } = props

    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Button
            style={[
                {
                    flex: 1,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingVertical: 12,

                    borderColor: theme.palette.borderColor,
                    backgroundColor: theme.palette.backgroundPrimary
                },
                props.style,
            ]}
            textStyle={[
                {
                    fontSize: 16,
                    fontWeight: '600',

                    color: theme.palette.textWhite,
                },
                props.textStyle,
            ]}
            {...restProps}
        />
    )
}

Button.Add = AddButton

const styles = StyleSheet.create({
    buttonContainer: {
        maxHeight: 55,
        borderRadius: 10,
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