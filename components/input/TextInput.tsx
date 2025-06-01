import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { Text, TextInput, TextInputProps, View } from "react-native"

interface TextInputBlockProps extends Omit<TextInputProps, 'value'> {
    value: string | undefined | null
    label: string
}

export function TextInputBlock(props: TextInputBlockProps) {
    const { theme } = useTheme()

    const { placeholderTextColor, value, style, ...restOfProps } = props

    return (
        <View style={inputElementStyles[theme].inputGroup}>
            {props.label && <Text style={inputElementStyles[theme].inputLabel}>{props.label}</Text>}
            <TextInput
                value={props.value || ''}
                style={[inputStyles[theme].textInput, props.value && { fontWeight: '900' }, props.style]}
                placeholderTextColor={theme === 'light' ? colors.white_500 : colors.white_600}
                {...restOfProps}
            />
        </View>
    )
}

export function TextInputBase(props: TextInputProps) {
    const { theme } = useTheme()

    const { placeholderTextColor, value, style, ...restOfProps } = props

    return (
        <TextInput
            value={props.value || ''}
            style={[inputStyles[theme].textInput, props.value && { fontWeight: '900' }, props.style]}
            placeholderTextColor={theme === 'light' ? colors.white_500 : colors.white_600}
            {...restOfProps}
        />
    )
}

export function TextInputNumeric(props: TextInputProps) {
    const { theme } = useTheme()

    const { placeholderTextColor, value, style, keyboardType, ...restOfProps } = props

    return (
        <TextInput
            value={props.value || ''}
            style={[inputStyles[theme].textInput, { width: '100%' }, props.value && { fontWeight: '900' }, props.style]}
            textAlign='center'
            keyboardType="numeric"
            placeholderTextColor={theme === 'light' ? colors.white_500 : colors.white_600}
            {...restOfProps}
        />
    )
}