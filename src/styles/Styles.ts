import { colors } from "@/const/color";
import { Dimensions, StyleSheet } from "react-native";

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
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.text.dimWhite,
    },
    fillerContainer: {
        flex: 1,
        minHeight: screenHeight * 0.45,
        justifyContent: 'flex-end',
        // alignItems: 'center',
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        // textAlign: 'center',
        paddingBottom: 15
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
    light: colors.text.dimWhite,
    dark: colors.background.black,
}