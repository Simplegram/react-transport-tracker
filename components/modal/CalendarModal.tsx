import { StandaloneModalProp } from "@/src/types/AddableTravels";
import { getFutureMonthFromLatestDate, getMonthsSinceEarliestDate } from "@/src/utils/dateUtils";
import { Modal, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { CalendarList } from "react-native-calendars";
import { useState } from "react";

interface CalendarModalProps {
    dates: any
    markedDates: {
        [date: string]: {
            [key: string]: any;
        };
    };
    modalElements: StandaloneModalProp
}

export default function CalendarModal({ dates, markedDates, modalElements }: CalendarModalProps) {
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
            <View style={styles.modalBackdrop}>
                <View style={styles.calendarContainer}>
                    <CalendarList
                        pastScrollRange={pastScrollRange}
                        futureScrollRange={futureScrollRange}
                        markedDates={markedDates}
                        onDayPress={modalElements.onSelect}
                        theme={{
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
                        }}
                    />
                    <TouchableOpacity
                        style={styles.todayButton}
                        onPress={() => modalElements.onSelect({ dateString: currentDate })}
                    >
                        <Text style={styles.todayButtonText}>Set Today</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    calendarContainer: {
        flex: 1,
        height: 500,
        backgroundColor: 'white',
        paddingTop: 10,
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
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});