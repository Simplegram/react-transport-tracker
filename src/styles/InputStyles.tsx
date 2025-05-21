import { colors } from "@/const/color";
import { Platform, StyleSheet } from "react-native";

const lightInputElementStyles = StyleSheet.create({
    inputContainer: {
        gap: 10,
        paddingBottom: 20,
    },
    inputGroup: {
        // This remains a simple wrapper, no specific styles needed here
        // It contains a label and an input field
    },
    inputLargeGroup: {
        gap: 16,
    },
    inputGroupCoord: {
        flex: 1,
        gap: 8,
        flexDirection: 'row',
    },
    inputGroupIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    inputGroupEnd: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 8,
    },
    inputLabelLight: {
        fontSize: 14,
        fontWeight: '300',
        color: '#4A4A4A',
        marginBottom: 5,
    },
    insideLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
})

const inputElementStyles = {
    light: lightInputElementStyles,
    dark: StyleSheet.create({
        inputContainer: {
            ...lightInputElementStyles.inputContainer,
        },
        inputGroup: {
            ...lightInputElementStyles.inputGroup,
        },
        inputLargeGroup: {
            ...lightInputElementStyles.inputLargeGroup,
        },
        inputGroupCoord: {
            ...lightInputElementStyles.inputGroupCoord,
        },
        inputGroupIcon: {
            ...lightInputElementStyles.inputGroupIcon,
        },
        inputGroupEnd: {
            ...lightInputElementStyles.inputGroupEnd,
        },
        inputLabel: {
            ...lightInputElementStyles.inputLabel,
            color: colors.text.dimWhite,
        },
        inputLabelLight: {
            ...lightInputElementStyles.inputLabelLight,
        },
        insideLabel: {
            ...lightInputElementStyles.insideLabel,
            color: colors.text.dimmerWhite,
        },
    })
}

const lightInputStyles = StyleSheet.create({
    textInput: {
        backgroundColor: colors.text.dimWhite,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 14 : 12,
        minHeight: Platform.OS === 'ios' ? 50 : 48,
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: colors.text.dimmerWhite,
    },
    multilineTextInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    pressableInput: {
        backgroundColor: colors.text.dimWhite,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 14 : 12,
        justifyContent: 'center',
        minHeight: Platform.OS === 'ios' ? 50 : 48,
        borderWidth: 1,
        borderColor: colors.text.dimmerWhite,
    },
    pressableInputCoord: {
        flex: 1,
    }
})

const inputStyles = {
    light: lightInputStyles,
    dark: StyleSheet.create({
        textInput: {
            ...lightInputStyles.textInput,
            color: colors.text.dimWhite,
            backgroundColor: '#000'
        },
        multilineTextInput: {
            ...lightInputStyles.multilineTextInput,
            backgroundColor: '#000'
        },
        pressableInput: {
            ...lightInputStyles.pressableInput,
            backgroundColor: '#000'
        },
        pressableInputCoord: {
            ...lightInputStyles.pressableInputCoord,
        }
    })
}

const iconPickerStyles = StyleSheet.create({
    iconContainer: {
        width: 55,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 5,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconTextContainer: {
        width: 75,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingTop: 10,
        flexDirection: 'column',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIconContainer: {
        borderColor: '#0284f5',
        backgroundColor: '#e3f2fd',
    },
});

export {
    inputStyles,
    inputElementStyles,
    iconPickerStyles
};