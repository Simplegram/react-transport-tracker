import { colors } from "@/const/color";
import { StyleSheet } from "react-native";

const lightTravelCardStyles = StyleSheet.create({
    cardHolder: {
        gap: 12,
    },
    card: {
        padding: 12,
        gap: 8,
        backgroundColor: '#ecf0f1',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
    },
    routeInfoSection: {},
    routeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 4,
        textAlign: 'center',
    },
    vehicleText: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    stopsTimeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stopTimeBlock: {
        flex: 1,
        alignItems: 'center',
    },
    stopText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
        textAlign: 'center',
    },
    timeText: {
        fontSize: 12,
        color: '#555',
        fontWeight: 'bold',
        marginBottom: 2,
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
    lapText: {
        fontWeight: 'bold'
    },
    notesSection: {},
    notesLabel: {
        fontSize: 12,
        color: '#555',
        fontWeight: 'bold',
    },
    notesText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#555',
    },
})

export const travelCardStyles = {
    light: lightTravelCardStyles,
    dark: StyleSheet.create({
        cardHolder: {
            ...lightTravelCardStyles.cardHolder,
        },
        card: {
            ...lightTravelCardStyles.card,
            backgroundColor: colors.background.black,
            borderColor: colors.text.dimmerWhite,
        },
        routeInfoSection: {
            ...lightTravelCardStyles.routeInfoSection,
        },
        routeText: {
            ...lightTravelCardStyles.routeText,
            color: colors.dimmerAppBlue,
        },
        vehicleText: {
            ...lightTravelCardStyles.vehicleText,
            color: colors.text.dimmerWhite,
        },
        stopsTimeSection: {
            ...lightTravelCardStyles.stopsTimeSection,
        },
        stopTimeBlock: {
            ...lightTravelCardStyles.stopTimeBlock,
        },
        stopText: {
            ...lightTravelCardStyles.stopText,
            color: colors.dimmerAppBlue,
        },
        timeText: {
            ...lightTravelCardStyles.timeText,
            color: colors.text.dimmerWhite,
        },
        stopArrowBlock: {
            ...lightTravelCardStyles.stopArrowBlock,
        },
        stopArrowText: {
            ...lightTravelCardStyles.stopArrowText,
            color: colors.text.dimmerWhite,
        },
        lapsSection: {
            ...lightTravelCardStyles.lapsSection,
        },
        lapText: {
            ...lightTravelCardStyles.lapText,
            color: colors.text.dimmerWhite,
        },
        notesSection: {
            ...lightTravelCardStyles.notesSection,
        },
        notesLabel: {
            ...lightTravelCardStyles.notesLabel,
            color: colors.text.dimmerWhite,
        },
        notesText: {
            ...lightTravelCardStyles.notesText,
            color: colors.text.dimmerWhite,
        },
    })
}

const lightTravelEmptyContainer = StyleSheet.create({
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    noDataText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#888',
    },
})

export const travelEmptyContainer = {
    light: lightTravelEmptyContainer,
    dark: StyleSheet.create({
        noDataContainer: {
            ...lightTravelEmptyContainer.noDataContainer,
        },
        noDataText: {
            ...lightTravelEmptyContainer.noDataText,
            color: colors.text.dimWhite,
        },
    })
}