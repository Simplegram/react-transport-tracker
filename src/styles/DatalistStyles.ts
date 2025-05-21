import { colors } from "@/const/color";
import { StyleSheet } from "react-native";

const lightDatalistStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        gap: 10,
        backgroundColor: colors.background.white,
    },
    listContent: {
        gap: 10,
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
        borderColor: colors.background.black,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: colors.background.white,
    }
})

const lightItemStyles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'column',
    },
    itemContainer: {
        padding: 10,
        flexDirection: 'column',
        backgroundColor: colors.background.white,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.background.black,
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
        color: colors.appBlue,
    },
    modifyButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    modifyButtonText: {
        color: colors.background.white,
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
            backgroundColor: colors.background.black,
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
            borderColor: colors.text.dimWhite,
            backgroundColor: colors.background.black,
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
            borderColor: colors.text.dimWhite,
            backgroundColor: colors.background.black,
        },
        textContainer: {
            ...lightItemStyles.textContainer,
        },
        itemTitle: {
            ...lightItemStyles.itemTitle,
            color: colors.text.dimmerWhite,
        },
        itemSubtitle: {
            ...lightItemStyles.itemSubtitle,
            color: colors.dimmerAppBlue,
        },
        modifyButton: {
            ...lightItemStyles.modifyButton,
            borderWidth: 1,
            borderColor: colors.dimmerAppBlue,
            backgroundColor: colors.background.black,
        },
        modifyButtonText: {
            ...lightItemStyles.modifyButtonText,
            color: colors.text.dimmerWhite,
        },
        fillerContainer: {
            ...lightItemStyles.fillerContainer,
        },
    })
}