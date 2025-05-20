import { colors } from "@/const/color";
import { StyleSheet } from "react-native";

export const travelCardStyles = {
    light: StyleSheet.create({
        cardHolder: {
            gap: 10,
        },
        card: {
            padding: 15,
            backgroundColor: '#ecf0f1',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#000',
        },
        routeInfoSection: {
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#dcdcdc',
            paddingBottom: 10,
        },
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
            paddingBottom: 10,
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#dcdcdc',
        },
        stopTimeBlock: {
            flex: 1,
            paddingVertical: 8,
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
            paddingHorizontal: 10,
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
        notesSection: {
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#dcdcdc',
        },
        notesLabel: {
            fontSize: 12,
            color: '#555',
            fontWeight: 'bold',
            marginBottom: 4,
        },
        notesText: {
            fontSize: 14,
            fontStyle: 'italic',
            color: '#555',
        },
    }),
    dark: StyleSheet.create({
        card: {
            backgroundColor: colors.background.black,
            borderColor: colors.background.white,
        },
        routeText: {
            color: '#5facfa',
        },
        vehicleText: {
            color: '#add6d9',
        },
        stopArrowText: {
            color: '#bfbfbf',
        },
        whiteText: {
            color: colors.background.dimWhite
        },
        notesLabel: {
            color: '#bababa'
        }
    })
}

export const travelEmptyContainer = {
    light: StyleSheet.create({
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
    }),
    dark: StyleSheet.create({
        noDataText: {
            color: colors.text.dimWhite,
        },
    })
}