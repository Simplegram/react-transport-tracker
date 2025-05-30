import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightTravelDetailStyles = StyleSheet.create({
    container: {
        gap: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    card: {
        backgroundColor: colors.white_100,
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        gap: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        borderBottomWidth: 0.5,
        borderBottomColor: colors.black,
        paddingBottom: 5,
        color: '#555',
    },
    detailRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    value: {},
    valueText: {
        fontSize: 14,
        color: '#555',
        flexShrink: 1,
        fontWeight: 'bold',
    },
    specialValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
})

export const travelDetailStyles = {
    light: lightTravelDetailStyles,
    dark: StyleSheet.create({
        container: {
            ...lightTravelDetailStyles.container,
        },
        centered: {
            ...lightTravelDetailStyles.centered,
        },
        title: {
            ...lightTravelDetailStyles.title,
        },
        card: {
            ...lightTravelDetailStyles.card,
            borderWidth: 1,
            borderColor: colors.white_100,
            backgroundColor: colors.black,
        },
        cardTitle: {
            ...lightTravelDetailStyles.cardTitle,
            color: colors.white_100,
            borderBottomColor: colors.white_100,
        },
        detailRow: {
            ...lightTravelDetailStyles.detailRow,
            borderColor: colors.white_300,
        },
        label: {
            ...lightTravelDetailStyles.label,
            color: colors.white_400,
        },
        value: {
            ...lightTravelDetailStyles.value,
        },
        valueText: {
            ...lightTravelDetailStyles.valueText,
            color: colors.white_300,
        },
        specialValue: {
            ...lightTravelDetailStyles.specialValue,
            color: colors.primary_100,
        },
    })
}