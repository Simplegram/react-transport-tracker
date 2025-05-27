import { colors } from "@/src/const/color"
import { Dimensions, StyleSheet } from "react-native"

const { width, height } = Dimensions.get('window')

const lightLoadingStyles = StyleSheet.create({
    modalOverlay: {
        width: width,
        height: height,
        flex: 1,
        position: "absolute",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
})

export const loadingStyles = {
    light: lightLoadingStyles,
    dark: StyleSheet.create({
        modalOverlay: {
            ...lightLoadingStyles.modalOverlay,
        },
        modalContent: {
            ...lightLoadingStyles.modalContent,
            borderWidth: 1,
            borderColor: colors.dimmerWhite,
            backgroundColor: colors.black,
        },
        loadingText: {
            ...lightLoadingStyles.loadingText,
            color: colors.dimWhite,
        },
    })
}