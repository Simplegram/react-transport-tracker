import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightStyles = StyleSheet.create({
    icon: {
        alignItems: 'center',
    },
})

export const styles = {
    light: lightStyles,
    dark: StyleSheet.create({
        icon: {
            ...lightStyles.icon,
            color: colors.white_300,
        }
    })
}

export const dividerStyles = {
    light: colors.black,
    dark: colors.white_300,
}

export const statusBarStyles = {
    light: colors.white_100,
    dark: colors.black,
}