import { StandaloneModalProp } from "@/src/types/AddableTravels";
import { getFutureMonthFromLatestDate, getMonthsSinceEarliestDate } from "@/src/utils/dateUtils";
import { Modal, StyleSheet, View } from "react-native";
import { CalendarList } from "react-native-calendars";

interface DateObject {
    dateString: string,
    day: number,
    month: number,
    timestamp: number,
    year: number
}

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
    const pastScrollRange = getMonthsSinceEarliestDate(dates)
    const futureScrollRange = getFutureMonthFromLatestDate(dates, 1)

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
    },
});