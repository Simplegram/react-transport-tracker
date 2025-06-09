import { colors } from "@/src/const/color"
import { Theme } from "react-native-calendars/src/types"

const lightCalendarTheme: Theme = {
    calendarBackground: colors.white_100,
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
        dayTextColor: colors.white_200,
        monthTextColor: colors.white_100,
    },
}