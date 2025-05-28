import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"
import { Theme } from "react-native-calendars/src/types"

const lightCalendarStyles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    calendarContainer: {
        flex: 1,
        height: 500,
        backgroundColor: colors.white,
        position: 'relative',
    },
    todayButton: {
        position: 'absolute',
        bottom: 35,
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        zIndex: 1,
    },
    todayButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
})

const lightCalendarTheme: Theme = {
    calendarBackground: colors.dimWhite,
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    arrowColor: '#00adf5',
    indicatorColor: '#00adf5',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
}

export const calendarTheme = {
    light: lightCalendarTheme,
    dark: {
        ...lightCalendarTheme,
        calendarBackground: '#000',
        dayTextColor: colors.dimmerWhite2,
        monthTextColor: colors.dimmerWhite2,
    },
}

export const calendarStyles = {
    light: { ...lightCalendarStyles },
    dark: StyleSheet.create({
        modalBackdrop: {
            ...lightCalendarStyles.modalBackdrop,
        },
        calendarContainer: {
            ...lightCalendarStyles.calendarContainer,
            color: colors.black,
        },
        todayButton: {
            ...lightCalendarStyles.todayButton,
            backgroundColor: colors.dimAppBlue,
        },
        todayButtonText: {
            ...lightCalendarStyles.todayButtonText,
            color: colors.dimmerWhite,
        },
    }),
}