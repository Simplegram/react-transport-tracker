import { colors } from "@/const/color";
import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
    icon: {
        paddingLeft: 5,
        alignItems: 'center',
    },
})

const { height: screenHeight } = Dimensions.get('window');

export const collapsibleHeaderStyles = {
    light: StyleSheet.create({
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
    }),
    dark: StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 15,
            paddingBottom: 15,
            backgroundColor: colors.background.black,
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
            paddingHorizontal: 10,
            color: colors.text.dimWhite,
        },
        scrollContainer: {
            flexGrow: 1,
        }
    }),
}

export const dividerStyles = {
    light: colors.background.black,
    dark: '#ffffff',
}

export const statusBarStyles = {
    light: '#ffffff',
    dark: colors.background.black,
}