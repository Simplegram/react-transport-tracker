import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightFlatlistStyles = StyleSheet.create({
    item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.text.dimmerWhite2,
        backgroundColor: colors.text.dimWhite,
    },
})

const flatlistStyles = {
    light: lightFlatlistStyles,
    dark: StyleSheet.create({
        item: {
            ...lightFlatlistStyles.item,
            backgroundColor: colors.background.black,
        },
    })
}

const lightModalElementStyles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    closeLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
})

const modalElementStyles = {
    light: lightModalElementStyles,
    dark: StyleSheet.create({
        label: {
            ...lightModalElementStyles.label,
            color: colors.text.dimmerWhite,
        },
        header: {
            ...lightModalElementStyles.header,
        },
        title: {
            ...lightModalElementStyles.title,
            color: colors.text.dimWhite,
        },
        closeLabel: {
            ...lightModalElementStyles.closeLabel,
            color: colors.text.dimWhite,
        },
    })
}

const lightModalStyles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: colors.text.dimWhite,
        justifyContent: 'space-between',
        gap: 10,
    },
    lapModalContainer: {
        maxHeight: 600
    },
    coordModalContainer: {
        height: 475
    },
    inputContainer: {
        gap: 10,
        minHeight: 100,
        maxHeight: 325,
        flexDirection: 'column',
    },
    modalSearchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    emptyList: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        gap: 10,
    },
})

const modalStyles = {
    light: lightModalStyles,
    dark: StyleSheet.create({
        modalBackdrop: {
            ...lightModalStyles.modalBackdrop,
        },
        modalContainer: {
            ...lightModalStyles.modalContainer,
            borderRadius: 16,
            borderWidth: 1,
            borderTopColor: colors.text.dimmerWhite,
            backgroundColor: colors.background.black,
        },
        lapModalContainer: {
            ...lightModalStyles.lapModalContainer,
        },
        coordModalContainer: {
            ...lightModalStyles.coordModalContainer,
        },
        inputContainer: {
            ...lightModalStyles.inputContainer,
        },
        modalSearchInput: {
            ...lightModalStyles.modalSearchInput,
        },
        emptyList: {
            ...lightModalStyles.emptyList,
        },
        scrollView: {
            ...lightModalStyles.scrollView,
        },
    })
}

export {
    flatlistStyles,
    modalElementStyles,
    modalStyles
}

