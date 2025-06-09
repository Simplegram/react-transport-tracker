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
        borderBottomColor: colors.white_400,
        backgroundColor: colors.white_100,
    },
})

const flatlistStyles = {
    light: lightFlatlistStyles,
    dark: StyleSheet.create({
        item: {
            ...lightFlatlistStyles.item,
            backgroundColor: colors.black,
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
            color: colors.white_300,
        },
        header: {
            ...lightModalElementStyles.header,
        },
        title: {
            ...lightModalElementStyles.title,
            color: colors.white_100,
        },
        closeLabel: {
            ...lightModalElementStyles.closeLabel,
            color: colors.white_100,
        },
    })
}

const lightModalStyles = StyleSheet.create({
    lapModalContainer: {
        maxHeight: 600
    },
    coordModalContainer: {
        height: 475
    },
    inputContainer: {
        gap: 10,
        minHeight: 125,
        maxHeight: 325,
        flexDirection: 'column',
    },
    modalSearchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
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

