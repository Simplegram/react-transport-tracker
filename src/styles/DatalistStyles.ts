import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightItemStyles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        flexDirection: 'column',
        backgroundColor: colors.white_100,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.black,
        gap: 10,
    },
    modifyButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
})

export const ItemStyles = {
    light: lightItemStyles,
    dark: StyleSheet.create({
        itemContainer: {
            ...lightItemStyles.itemContainer,
            borderColor: colors.white_100,
            backgroundColor: colors.black,
        },
        modifyButton: {
            ...lightItemStyles.modifyButton,
            borderWidth: 1,
            borderColor: colors.primary_100,
            backgroundColor: colors.black,
        },
    })
}