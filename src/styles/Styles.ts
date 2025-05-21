import { colors } from "@/const/color";
import { StyleSheet, Dimensions } from "react-native";

const { height: screenHeight } = Dimensions.get('window');

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
            color: colors.text.dimmerWhite,
        }
    })
}

const lightCollapsibleHeaderStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    fillerContainer: {
        flex: 1,
        minHeight: screenHeight * 0.45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 10
    },
    scrollContainer: {
        flexGrow: 1,
    }
})

export const collapsibleHeaderStyles = {
    light: lightCollapsibleHeaderStyles,
    dark: StyleSheet.create({
        container: {
            ...lightCollapsibleHeaderStyles.container,
            backgroundColor: colors.background.black,
        },
        fillerContainer: {
            ...lightCollapsibleHeaderStyles.fillerContainer,
        },
        headerText: {
            ...lightCollapsibleHeaderStyles.headerText,
            color: colors.text.dimWhite,
        },
        scrollContainer: {
            ...lightCollapsibleHeaderStyles.scrollContainer,
        }
    }),
}

export const dividerStyles = {
    light: colors.background.black,
    dark: colors.text.dimmerWhite,
}

export const statusBarStyles = {
    light: colors.background.white,
    dark: colors.background.black,
}