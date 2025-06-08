import { useTheme } from '@/context/ThemeContext'
import { darkenColor, getBackgroundColorFromStyle } from '@/src/utils/colorUtils'
import { Pressable, PressableProps, StyleProp, Text, TextStyle, View, ViewProps, ViewStyle } from 'react-native'

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
            <Text style={[
                {
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                },
                props.textStyle
            ]}>
                {props.label ? props.label : props.children}
            </Text>
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

function AddButton(props: Props) {
    const { style, textStyle, ...restProps } = props

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

function CancelButton(props: Props) {
    const { style, textStyle, ...restProps } = props

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

Button.Row = ButtonRow

Button.Add = AddButton
Button.Cancel = CancelButton
Button.Dismiss = DismissButton