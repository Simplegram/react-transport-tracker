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
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
        height: 300,
        justifyContent: 'space-between',
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
            backgroundColor: colors.black,
            borderColor: colors.white_300,
        },
        routeInfoSection: {
            ...lightTravelCardStyles.routeInfoSection,
        },
        routeText: {
            ...lightTravelCardStyles.routeText,
            color: colors.primary_100,
        },
        vehicleText: {
            ...lightTravelCardStyles.vehicleText,
            color: colors.white_300,
        },
        stopsTimeSection: {
            ...lightTravelCardStyles.stopsTimeSection,
        },
        stopTimeBlock: {
            ...lightTravelCardStyles.stopTimeBlock,
        },
        stopText: {
            ...lightTravelCardStyles.stopText,
            color: colors.primary_100,
        },
        timeText: {
            ...lightTravelCardStyles.timeText,
            color: colors.white_300,
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
        lapText: {
            ...lightTravelCardStyles.lapText,
            color: colors.white_300,
        },
        notesSection: {
            ...lightTravelCardStyles.notesSection,
        },
        notesLabel: {
            ...lightTravelCardStyles.notesLabel,
            color: colors.white_300,
        },
        notesText: {
            ...lightTravelCardStyles.notesText,
            color: colors.white_300,
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
            color: colors.white_100,
        },
    })
}