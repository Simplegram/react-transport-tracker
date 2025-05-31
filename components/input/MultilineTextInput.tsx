import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { StyleSheet, Text, TextInput, View } from "react-native"

interface MultilineInputProps {
    editable?: boolean
    value: any
    label: string
    placeholder: string
    onChangeText?: (text: string) => void
}

export default function MultilineTextInput({ value, label, placeholder, onChangeText }: MultilineInputProps) {
    const { theme } = useTheme()

    return (
        <View style={inputElementStyles[theme].inputGroup}>
            <Text style={inputElementStyles[theme].inputLabel}>{label}</Text>
            <TextInput
                style={[inputStyles[theme].textInput, inputStyles[theme].multilineTextInput, value && { fontWeight: '900' }]}
                value={value || ''}
                onChangeText={onChangeText}
                multiline={true}
                numberOfLines={4}
                placeholder={placeholder}
                placeholderTextColor={theme === 'light' ? colors.white_500 : colors.white_600}
            />
        </View>
    )
}