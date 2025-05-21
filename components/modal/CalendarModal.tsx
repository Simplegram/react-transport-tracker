import { useTheme } from "@/context/ThemeContext";
import { calendarStyles, calendarTheme } from "@/src/styles/CalendarStyles";
import { StandaloneModalProp } from "@/src/types/AddableTravels";
import { getFutureMonthFromLatestDate, getMonthsSinceEarliestDate } from "@/src/utils/dateUtils";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { CalendarList } from "react-native-calendars";

interface CalendarModalProps {
    dates: any
    markedDates: {
        [date: string]: {
            [key: string]: any;
        };
    };
    currentSelectedDate: string
    modalElements: StandaloneModalProp
}

export default function CalendarModal({ dates, markedDates, currentSelectedDate, modalElements }: CalendarModalProps) {
    const { theme } = useTheme()

    const pastScrollRange = getMonthsSinceEarliestDate(dates);
    const futureScrollRange = getFutureMonthFromLatestDate(dates, 1);
    const [currentDate] = useState(new Date().toISOString().split('T')[0]);

    return (
        <Modal
            visible={modalElements.isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={modalElements.onClose}
        >
            <View style={calendarStyles[theme].modalBackdrop}>
                <View style={calendarStyles[theme].calendarContainer}>
                    <CalendarList
                        current={currentSelectedDate}
                        pastScrollRange={pastScrollRange}
                        futureScrollRange={futureScrollRange}
                        markedDates={markedDates}
                        onDayPress={modalElements.onSelect}
                        theme={calendarTheme[theme]}
                    />
                    <TouchableOpacity
                        style={calendarStyles[theme].todayButton}
                        onPress={() => modalElements.onSelect({ dateString: currentDate })}
                    >
                        <Text style={calendarStyles[theme].todayButtonText}>Set Today</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}