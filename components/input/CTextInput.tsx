import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { StyleProp, Text, TextInput, View, ViewStyle } from "react-native"

interface TextInputProps {
    editable?: boolean
    value: any
    label?: string
    placeholder: string
    style?: StyleProp<ViewStyle>
    onChangeText?: (text: string) => void
}

export default function CTextInput({ editable = true, value, label, placeholder, style, onChangeText }: TextInputProps) {
    const { theme } = useTheme()

    return (
        <View style={inputElementStyles[theme].inputGroup}>
            {label && <Text style={inputElementStyles[theme].inputLabel}>{label}</Text>}
            <TextInput
                editable={editable}
                style={[inputStyles[theme].textInput, value && { fontWeight: '900' }, style]}
                value={value || ''}
                placeholder={placeholder}
                placeholderTextColor={theme === 'light' ? colors.white_500 : colors.white_600}
                onChangeText={onChangeText}
            />
        </View>
    )
}