import { colors } from "@/const/color"
import { StyleSheet } from "react-native"

const lightTravelDetailStyles = StyleSheet.create({
    container: {
        gap: 15,
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
        backgroundColor: colors.dimWhite,
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        gap: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
        color: '#555',
    },
    detailRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'flex-start',
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
        color: colors.appBlue,
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
            borderColor: colors.dimWhite,
            backgroundColor: colors.black,
        },
        cardTitle: {
            ...lightTravelDetailStyles.cardTitle,
            color: colors.dimWhite,
        },
        detailRow: {
            ...lightTravelDetailStyles.detailRow,
            borderColor: colors.dimmerWhite,
        },
        label: {
            ...lightTravelDetailStyles.label,
            color: colors.dimmerWhite2,
        },
        value: {
            ...lightTravelDetailStyles.value,
        },
        valueText: {
            ...lightTravelDetailStyles.valueText,
            color: colors.dimmerWhite,
        },
        specialValue: {
            ...lightTravelDetailStyles.specialValue,
            color: colors.dimmerAppBlue,
        },
    })
}