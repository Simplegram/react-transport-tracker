import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightDatalistStyles = StyleSheet.create({
    container: {
        gap: 10,
        flex: 1,
        paddingTop: 5,
        paddingBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: colors.white_100,
    },
    listContent: {
        gap: 8,
        flexGrow: 1,
    },
    addButtonContainer: {

    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
    },
    modalSearchInput: {
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: colors.white,
    }
})

const lightItemStyles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'column',
    },
    itemContainer: {
        padding: 10,
        flexDirection: 'column',
        backgroundColor: colors.white_100,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.black,
        gap: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },
    itemTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemSubtitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    modifyButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    modifyButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    fillerContainer: {
        flex: 1,
    },
})

export const DatalistStyles = {
    light: lightDatalistStyles,
    dark: StyleSheet.create({
        container: {
            ...lightDatalistStyles.container,
            backgroundColor: colors.black,
        },
        listContent: {
            ...lightDatalistStyles.listContent,
        },
        addButtonContainer: {
            ...lightDatalistStyles.addButtonContainer,
        },
        emptyContainer: {
            ...lightDatalistStyles.emptyContainer,
        },
        emptyText: {
            ...lightDatalistStyles.emptyText,
        },
        modalSearchInput: {
            ...lightDatalistStyles.modalSearchInput,
            borderColor: colors.white_100,
            backgroundColor: colors.black,
        }
    })
}

export const ItemStyles = {
    light: lightItemStyles,
    dark: StyleSheet.create({
        buttonContainer: {
            ...lightItemStyles.buttonContainer,
        },
        itemContainer: {
            ...lightItemStyles.itemContainer,
            borderColor: colors.white_100,
            backgroundColor: colors.black,
        },
        textContainer: {
            ...lightItemStyles.textContainer,
        },
        itemTitle: {
            ...lightItemStyles.itemTitle,
            color: colors.white_100,
        },
        itemSubtitle: {
            ...lightItemStyles.itemSubtitle,
            color: colors.primary_100,
        },
        modifyButton: {
            ...lightItemStyles.modifyButton,
            borderWidth: 1,
            borderColor: colors.primary_100,
            backgroundColor: colors.black,
        },
        modifyButtonText: {
            ...lightItemStyles.modifyButtonText,
            color: colors.white_100,
        },
        fillerContainer: {
            ...lightItemStyles.fillerContainer,
        },
    })
}