import { useTheme } from "@/context/ThemeContext"
import { Text, TextProps, View, ViewProps } from "react-native"

export default function Input(props: ViewProps) {
    return (
        <View {...props} />
    )
}

function Container(props: ViewProps) {
    const { style, ...restProps } = props

    return (
        <Input
            style={[
                {
                    gap: 12,
                    paddingBottom: 15,
                }, style
            ]}
            {...restProps}
        />
    )
}

function Header(props: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { style, children, ...restProps } = props

    return (
        <Text
            style={[
                {
                    fontSize: 20,
                    fontWeight: '600',
                    color: theme.palette.textBlack,
                }, style
            ]}
            {...restProps}
        >{children}</Text>
    )
}

function Title(props: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { style, children, ...restProps } = props

    return (
        <Text
            style={[
                {
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.palette.textBlack,
                }, style
            ]}
            {...restProps}
        >{children}</Text>
    )
}

function Subtitle(props: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { style, children, ...restProps } = props

    return (
        <Text
            style={[
                {
                    fontSize: 15,
                    fontWeight: '600',
                    color: theme.palette.textPrimary,
                }, style
            ]}
            {...restProps}
        >{children}</Text>
    )
}

function Label(props: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { style, children, ...restProps } = props

    return (
        <Text
            style={[
                {
                    fontSize: 15,
                    fontWeight: '500',
                    marginBottom: 4,
                    color: theme.palette.textBlack,
                }, style
            ]}
            {...restProps}
        >{children}</Text>
    )
}

function LabelLight(props: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { style, children, ...restProps } = props

    return (
        <Text
            style={[
                {
                    fontSize: 14,
                    fontWeight: '500',
                    color: theme.palette.textDark,
                }, style
            ]}
            {...restProps}
        >{children}</Text>
    )
}

function ValueText(props: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { style, children, ...restProps } = props

    return (
        <Text
            style={[
                {
                    fontSize: 14,
                    flexShrink: 1,
                    fontWeight: 'bold',

                    color: theme.palette.textDark,
                }, style
            ]}
            {...restProps}
        >{children}</Text>
    )
}

function LoadingLabel(props: TextProps) {
    return (
        <Title {...props}>Loading...</Title>
    )
}

Input.Container = Container

Input.Header = Header

Input.Title = Title
Input.Subtitle = Subtitle

Input.Label = Label
Input.LabelLight = LabelLight
Input.ValueText = ValueText

Input.LoadingLabel = LoadingLabel