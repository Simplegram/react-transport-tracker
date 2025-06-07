import { useTheme } from '@/context/ThemeContext'
import { darkenColor, getBackgroundColorFromStyle } from '@/src/utils/colorUtils'
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export interface Props extends Omit<PressableProps, 'style'> {
    label?: string
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    color?: string
    darkenAmount?: number
    children?: string | React.ReactNode
}

export default function Button(props: Props) {
    const { theme } = useTheme()

    const { style, ...restProps } = props

    const buttonContainerStyle = ({ pressed }: { pressed: boolean }) => {
        const styleBackgroundColor = getBackgroundColorFromStyle(props.style)
        const baseBackgroundColor = styleBackgroundColor || props.color || '#f3f3f3'

        const backgroundColor = pressed ? darkenColor(baseBackgroundColor, props.darkenAmount || 0.3) : baseBackgroundColor
        const opacity = theme === 'dark' ? (pressed ? (props.darkenAmount || 0.7) : 1) : 1

        return [styles.buttonContainer, props.style, { backgroundColor, opacity: opacity }] as StyleProp<ViewStyle>
    }

    return (
        <Pressable style={buttonContainerStyle} {...restProps}>
            <Text style={[styles.buttonText, props.textStyle]}>
                {props.label ? props.label : props.children}
            </Text>
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

                    borderColor: theme.palette.borderColorPrimary,
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

function DismissButton(props: Props) {
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
                    backgroundColor: theme.palette.background
                },
                props.style,
            ]}
            textStyle={[
                {
                    fontSize: 16,
                    fontWeight: '600',

                    color: theme.palette.textBlack,
                },
                props.textStyle,
            ]}
            {...restProps}
        />
    )
}

Button.Add = AddButton
Button.Dismiss = DismissButton

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