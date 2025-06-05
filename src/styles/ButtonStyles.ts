import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightButtonStyles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
    },
    addButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        borderWidth: 1,
    },
    addButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: 12,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: colors.white_100
    },
    cancelButtonText: {
        color: colors.black,
        fontSize: 16,
        fontWeight: '600',
    },
    redButton: {
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: colors.redCancel,
    },
    inactiveButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.white_500,
        backgroundColor: colors.white_100,
    },
    inactiveButtonText: {
        color: colors.white_500,
        fontSize: 16,
        fontWeight: '600',
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
            borderColor: colors.primary_100,
            backgroundColor: colors.black,
        },
        addButtonText: {
            ...lightButtonStyles.addButtonText,
            color: colors.white_100,
        },
        cancelButton: {
            ...lightButtonStyles.cancelButton,
            borderColor: colors.white_300,
            backgroundColor: colors.black,
        },
        cancelButtonText: {
            ...lightButtonStyles.cancelButtonText,
            color: colors.white_100,
        },
        redButton: {
            ...lightButtonStyles.redButton,
            borderColor: colors.redCancel_100,
            backgroundColor: colors.black,
        },
        inactiveButton: {
            ...lightButtonStyles.inactiveButton,
            backgroundColor: colors.black,
        },
        inactiveButtonText: {
            ...lightButtonStyles.inactiveButtonText,
        },
    })
}