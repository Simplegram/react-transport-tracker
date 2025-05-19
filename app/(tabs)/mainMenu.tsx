import useTravelCalendar from "@/hooks/useTravelCalendar";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Calendar, WeekCalendar } from 'react-native-calendars';
import GroupedDataDisplay from "@/components/GroupedTravelsDisplay";
import { useFocusEffect } from "expo-router";
import { useToggleLoading } from "@/hooks/useLoading";
import LoadingScreen from "@/components/LoadingScreen";
import Button from "@/components/BaseButton";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import CalendarModal from "@/components/modal/CalendarModal";
import useStopModal from "@/hooks/useStopModal";
import { getTodayString } from "@/src/utils/dateUtils";

const { height: screenHeight } = Dimensions.get('window');

interface DateObject {
    dateString: string,
    day: number,
    month: number,
    timestamp: number,
    year: number
}

export default function HomePage() {
    const {
        travelAtDate, getTravelAtDate, getDates,
        dates, selectedDate, setSelectedDate,
    } = useTravelCalendar()

    const { loading, toggleLoading } = useToggleLoading()

    const {
        showStopModal: showCalendarModal,
        openStopModal: openCalendarModal,
        closeStopModal: closeCalendarModal
    } = useStopModal();

    // Generate marked dates for the calendar
    const markedDates = useMemo(() => {
        const marked: any = {};

        // Mark dates that have items
        dates.forEach(date => {
            marked[date] = {
                ...marked[date], // Preserve any existing marking (like 'selected')
                marked: true,
                color: '#dcf8c6',
            };
        });

        // Mark the selected date distinctly
        marked[selectedDate] = {
            ...marked[selectedDate], // Preserve any item marking
            selected: true,
            selectedColor: '#00adf5', // Blue background for selected date
            selectedTextColor: 'white',
        };

        return marked;
    }, [selectedDate, dates]);

    const onDayPress = (day: DateObject) => {
        toggleLoading()
        setSelectedDate(day.dateString);
        closeCalendarModal()
    };

    useEffect(() => {
        getDates()
        setSelectedDate(getTodayString())
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getDates()
        }, [])
    )

    useFocusEffect(
        React.useCallback(() => {
            getTravelAtDate()
        }, [selectedDate])
    )

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                {loading == true ? (
                    <LoadingScreen></LoadingScreen>
                ) : (
                    <GroupedDataDisplay data={travelAtDate} currentDate={selectedDate}></GroupedDataDisplay>
                )}
            </View>
            <View style={styles.calendarContainer}>
                <Button 
                    style={[buttonStyles.addButton, { flex: 0 }]} 
                    textStyle={buttonStyles.addButtonText}
                    onPress={() => openCalendarModal()}
                >
                    View Calendar
                </Button>
            </View>
            <CalendarModal 
                dates={dates}
                markedDates={markedDates}
                modalElements={{
                    isModalVisible: showCalendarModal,
                    onClose: closeCalendarModal,
                    onSelect: onDayPress
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 10,
        paddingTop: 0,
        backgroundColor: '#fff'
    },
    calendarContainer: {
        backgroundColor: 'white',
        paddingTop: 10,
    },
    listContainer: {
        flex: 1,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    listContent: {
        flexGrow: 1,
    },
    listItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    noItemsText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
});