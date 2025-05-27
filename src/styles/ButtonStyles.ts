import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightButtonStyles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
    },
    addButton: {
        backgroundColor: colors.appBlue,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        borderWidth: 1,
    },
    addButtonText: {
        color: colors.text.white,
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: colors.text.dimWhite
    },
    cancelButtonText: {
        color: colors.text.black,
        fontSize: 16,
        fontWeight: '600',
    },
    redButton: {
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: colors.redCancel,
    },
})

export const buttonStyles = {
    light: lightButtonStyles,
    dark: StyleSheet.create({
        buttonRow: {
            ...lightButtonStyles.buttonRow,
        },
        addButton: {
            ...lightButtonStyles.addButton,
            borderColor: colors.dimmerAppBlue,
            backgroundColor: colors.black,
        },
        addButtonText: {
            ...lightButtonStyles.addButtonText,
            color: colors.text.dimWhite,
        },
        cancelButton: {
            ...lightButtonStyles.cancelButton,
            borderColor: colors.dimmerWhite,
            backgroundColor: colors.black,
        },
        cancelButtonText: {
            ...lightButtonStyles.cancelButtonText,
            color: colors.dimmerWhite,
        },
        redButton: {
            ...lightButtonStyles.redButton,
            borderColor: colors.dimRedCancel,
            backgroundColor: colors.black,
        },
    })
}