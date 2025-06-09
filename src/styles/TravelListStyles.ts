import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

const lightTravelCardStyles = StyleSheet.create({
    cardHolder: {
        gap: 12,
        flexGrow: 1,
    },
    card: {
        gap: 8,
        padding: 12,
        backgroundColor: colors.white_100,
        borderRadius: 10,
        borderColor: '#000',
        height: 300,
        justifyContent: 'space-between',
    },
    routeInfoSection: {},
    stopsTimeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stopTimeBlock: {
        flex: 1,
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    stopArrowBlock: {
        paddingHorizontal: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopArrowText: {
        fontSize: 20,
        color: '#7f8c8d',
    },
    lapsSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    notesSection: {},
})

export const travelCardStyles = {
    light: lightTravelCardStyles,
    dark: StyleSheet.create({
        cardHolder: {
            ...lightTravelCardStyles.cardHolder,
        },
        card: {
            ...lightTravelCardStyles.card,
            backgroundColor: colors.black,
            borderColor: colors.white_300,
        },
        routeInfoSection: {
            ...lightTravelCardStyles.routeInfoSection,
        },
        stopsTimeSection: {
            ...lightTravelCardStyles.stopsTimeSection,
        },
        stopTimeBlock: {
            ...lightTravelCardStyles.stopTimeBlock,
        },
        stopArrowBlock: {
            ...lightTravelCardStyles.stopArrowBlock,
        },
        stopArrowText: {
            ...lightTravelCardStyles.stopArrowText,
            color: colors.white_300,
        },
        lapsSection: {
            ...lightTravelCardStyles.lapsSection,
        },
        notesSection: {
            ...lightTravelCardStyles.notesSection,
        },
    })
}