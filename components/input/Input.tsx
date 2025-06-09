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

function TextBase({ style, children, ...props }: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Text
            style={[
                {
                    fontWeight: '600',
                    color: theme.palette.textBlack,
                }, style
            ]}
            {...props}
        >{children}</Text>
    )
}

function Header({ style, ...props }: TextProps) {
    return (
        <TextBase style={[{ fontSize: 20 }, style]} {...props} />
    )
}

function Title({ style, ...props }: TextProps) {
    return (
        <TextBase style={[{ fontSize: 18 }, style]} {...props} />
    )
}

function TitleDivide({ style, ...props }: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Title style={[
            {
                paddingBottom: 5,
                borderBottomWidth: 0.5,

                borderBottomColor: theme.palette.borderColor,
            }, style
        ]} {...props} />
    )
}

function Subtitle({ style, ...props }: TextProps) {
    return (
        <TextBase style={[{ fontSize: 16 }, style]} {...props} />
    )
}

function SubtitlePrimary({ style, ...props }: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Subtitle style={[{ color: theme.palette.textPrimary }, style]} {...props} />
    )
}

function Label({ style, ...props }: TextProps) {
    return (
        <TextBase style={[
            {
                fontSize: 15,
                fontWeight: '500',
                marginBottom: 4,
            }, style
        ]} {...props} />
    )
}

function LabelLight({ style, ...props }: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Label style={[
            {
                fontSize: 14,
                color: theme.palette.textDark,
            }, style
        ]} {...props} />
    )
}

function ValueText({ style, ...props }: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <TextBase style={[
            {
                fontSize: 14,
                flexShrink: 1,
                fontWeight: 'bold',

                color: theme.palette.textDark,
            }, style
        ]} {...props} />
    )
}

function LoadingLabel(props: TextProps) {
    return (
        <SubtitlePrimary {...props}>Loading...</SubtitlePrimary>
    )
}

Input.Container = Container

Input.Header = Header

Input.Title = Title
Input.TitleDivide = TitleDivide
Input.Subtitle = Subtitle
Input.SubtitlePrimary = SubtitlePrimary

Input.Label = Label
Input.LabelLight = LabelLight
Input.ValueText = ValueText

Input.LoadingLabel = LoadingLabel