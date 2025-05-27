import { colors } from "@/src/const/color"
import { Dimensions, StyleSheet } from "react-native"

const { height: screenHeight } = Dimensions.get('window')

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
            color: colors.dimmerWhite,
        }
    })
}

const lightCollapsibleHeaderStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        paddingHorizontal: 15,
        backgroundColor: colors.dimWhite,
    },
    contentContainer: {
        flexGrow: 1,
        overflow: 'hidden',
    },
    fillerContainer: {
        height: screenHeight * 0.43,
        justifyContent: 'flex-end',
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        paddingBottom: 15
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    }
})

export const collapsibleHeaderStyles = {
    light: lightCollapsibleHeaderStyles,
    dark: StyleSheet.create({
        container: {
            ...lightCollapsibleHeaderStyles.container,
            backgroundColor: colors.black,
        },
        contentContainer: {
            ...lightCollapsibleHeaderStyles.contentContainer,
        },
        fillerContainer: {
            ...lightCollapsibleHeaderStyles.fillerContainer,
        },
        headerText: {
            ...lightCollapsibleHeaderStyles.headerText,
            color: colors.dimWhite,
        },
        scrollContainer: {
            ...lightCollapsibleHeaderStyles.scrollContainer,
        }
    }),
}

export const dividerStyles = {
    light: colors.black,
    dark: colors.dimmerWhite,
}

export const statusBarStyles = {
    light: colors.dimWhite,
    dark: colors.black,
}