import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightMainmenuStyles = StyleSheet.create({
    container: {
        gap: 10,
        flexGrow: 1,
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.white_100,
    },
    listContainer: {
        flex: 1,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    listContent: {
        flexGrow: 1,
    },
    listItem: {
        backgroundColor: colors.white_100,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    noItemsText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
})

export const mainMenuStyles = {
    light: lightMainmenuStyles,
    dark: StyleSheet.create({
        container: {
            ...lightMainmenuStyles.container,
            backgroundColor: colors.black,
        },
        listContainer: {
            ...lightMainmenuStyles.listContainer,
        },
        listTitle: {
            ...lightMainmenuStyles.listTitle,
        },
        listContent: {
            ...lightMainmenuStyles.listContent,
        },
        listItem: {
            ...lightMainmenuStyles.listItem,
        },
        itemText: {
            ...lightMainmenuStyles.itemText,
        },
        noItemsText: {
            ...lightMainmenuStyles.noItemsText,
        },
    }),
}