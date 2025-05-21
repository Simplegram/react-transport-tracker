import { colors } from "@/const/color";
import { StyleSheet } from "react-native";

const lightMainmenuStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff'
    },
    calendarContainer: {
        backgroundColor: 'white',
        paddingTop: 10,
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
        backgroundColor: 'white',
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
            backgroundColor: colors.background.black,
        },
        calendarContainer: {
            ...lightMainmenuStyles.calendarContainer,
            backgroundColor: colors.background.black,
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