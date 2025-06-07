import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { Text, TextInput, TextInputProps, View } from "react-native"

export function TextInputBase(props: TextInputProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { placeholderTextColor, value, style, ...restOfProps } = props

    return (
        <TextInput
            value={props.value || ''}
            style={[
                {
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    minHeight: 48,
                    fontSize: 14,
                    fontWeight: '200',
                    borderWidth: 1,

                    color: theme.palette.textDark,
                    borderColor: theme.palette.borderColorSoft,
                    backgroundColor: theme.palette.background,
                },
                props.value && { fontWeight: '900' },
                props.style
            ]}
            placeholderTextColor={theme.palette.textPlaceholder}
            {...restOfProps}
        />
    )
}

function TextInputNumeric(props: TextInputProps) {
    const { textAlign, keyboardType, ...restOfProps } = props

    return (
        <TextInputBase
            style={{ width: '100%' }}
            textAlign='center'
            keyboardType="numeric"
            {...restOfProps}
        />
    )
}

interface TextInputBlockProps extends TextInputProps {
    label: string
}

export function TextInputBlock(props: TextInputBlockProps) {
    const { theme } = useTheme()

    const { label, ...restOfProps } = props

    return (
        <View style={inputElementStyles[theme].inputGroup}>
            {props.label && <Text style={inputElementStyles[theme].inputLabel}>{props.label}</Text>}
            <TextInputBase {...restOfProps} />
        </View>
    )
}

function TextInputMultiline(props: TextInputBlockProps) {
    const { theme } = useTheme()

    const { multiline, ...restOfProps } = props

    return (
        <TextInputBlock
            style={inputStyles[theme].multilineTextInput}
            multiline={true}
            numberOfLines={4}
            {...restOfProps}
        />
    )
}

TextInputBase.Numeric = TextInputNumeric

TextInputBlock.Multiline = TextInputMultiline