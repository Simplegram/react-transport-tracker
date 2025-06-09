import { useTheme } from '@/context/ThemeContext'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { darkenColor, getBackgroundColorFromStyle } from '@/src/utils/colorUtils'
import { Pressable, PressableProps, StyleProp, StyleSheet, TextStyle, View, ViewProps, ViewStyle } from 'react-native'
import Input from '../input/Input'

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

        return [
            {
                height: 50,
                maxHeight: 50,
                borderWidth: 1,
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 20,

                alignItems: 'center',
                justifyContent: 'center',

                backgroundColor,
                opacity: opacity,
            },
            props.style,
        ] as StyleProp<ViewStyle>
    }

    return (
        <Pressable style={buttonContainerStyle} {...restProps}>
            <Input.Subtitle style={props.textStyle}>{props.label ? props.label : props.children}</Input.Subtitle>
        </Pressable>
    )
}

function ButtonRow(props: ViewProps) {
    const { style, ...restProps } = props

    return (
        <View
            style={[
                {
                    gap: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                }, style
            ]}
            {...restProps}
        >
            {props.children}
        </View>
    )
}

function AddButton({ style, textStyle, ...props }: Props) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Button
            style={[
                {
                    flex: 1,
                    paddingVertical: 12,

                    borderColor: theme.palette.borderColorPrimary,
                    backgroundColor: theme.palette.backgroundPrimary
                },
                style,
            ]}
            textStyle={[
                {
                    fontSize: 16,
                    fontWeight: '600',

                    color: theme.palette.textWhite,
                },
                textStyle,
            ]}
            {...props}
        />
    )
}

function DismissButton({ style, textStyle, ...props }: Props) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Button
            style={[
                {
                    flex: 1,
                    paddingVertical: 12,

                    borderColor: theme.palette.borderColor,
                    backgroundColor: theme.palette.background
                },
                style,
            ]}
            textStyle={[
                {
                    fontSize: 16,
                    fontWeight: '600',

                    color: theme.palette.textBlack,
                },
                textStyle,
            ]}
            {...props}
        />
    )
}

function CancelButton({ style, textStyle, ...props }: Props) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Button
            style={[
                {
                    flex: 1,
                    paddingVertical: 12,

                    borderColor: theme.palette.borderColorRed,
                    backgroundColor: theme.palette.backgroundRed,
                },
                style,
            ]}
            textStyle={[
                {
                    fontSize: 16,
                    fontWeight: '600',

                    color: theme.palette.textWhite,
                },
                textStyle,
            ]}
            {...props}
        />
    )
}

interface SwitchButtonProps extends Props {
    switch: boolean
}

function SwitchButton({ style, textStyle, ...props }: SwitchButtonProps) {
    const { theme, getTheme } = useTheme()
    const newTheme = getTheme()

    const styles = StyleSheet.create({
        inactiveButton: {
            flex: 1,
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 10,
            paddingVertical: 12,

            borderColor: newTheme.palette.borderColorSoft,
            backgroundColor: newTheme.palette.background,
        },
        inactiveButtonText: {
            fontSize: 16,
            fontWeight: '600',

            color: newTheme.palette.textDark,
        },
    })

    return (
        <Button
            style={props.switch ? buttonStyles[theme].addButton : styles.inactiveButton}
            textStyle={props.switch ? buttonStyles[theme].addButtonText : styles.inactiveButtonText}
            {...props}
        >
            {props.children}
        </Button>
    )
}

Button.Row = ButtonRow

Button.Switch = SwitchButton

Button.Add = AddButton
Button.Cancel = CancelButton
Button.Dismiss = DismissButton