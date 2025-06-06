import { useTheme } from "@/context/ThemeContext"
import { calendarStyles, calendarTheme } from "@/src/styles/CalendarStyles"
import { StandaloneModalProp } from "@/src/types/AddableTravels"
import { getFutureMonthFromLatestDate, getMonthsSinceEarliestDate } from "@/src/utils/dateUtils"
import { useState } from "react"
import { Modal, View } from "react-native"
import { CalendarList } from "react-native-calendars"
import Button from "../BaseButton"

interface CalendarModalProps {
    dates: any
    markedDates: {
        [date: string]: {
            [key: string]: any
        }
    }
    currentSelectedDate: string
    modalElements: StandaloneModalProp
}

export default function CalendarModal({ dates, markedDates, currentSelectedDate, modalElements }: CalendarModalProps) {
    const { theme } = useTheme()

    const pastScrollRange = getMonthsSinceEarliestDate(dates, currentSelectedDate)
    const futureScrollRange = getFutureMonthFromLatestDate(currentSelectedDate)
    const [currentDate] = useState(new Date().toISOString().split('T')[0])

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
                        contentContainerStyle={{ paddingBottom: 30 }}
                    />
                    <View style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 0,
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1,
                        flexDirection: 'row',
                        gap: 5
                    }}>
                        <Button.Add label="Set Today" onPress={() => modalElements.onSelect({ dateString: currentDate })} style={{ flex: 0 }} />
                        <Button.Dismiss label="Close" onPress={modalElements.onClose} style={{ flex: 0 }} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}