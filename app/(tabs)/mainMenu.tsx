import Button from "@/components/BaseButton";
import GroupedDataDisplay from "@/components/GroupedTravelsDisplay";
import LoadingScreen from "@/components/LoadingScreen";
import CalendarModal from "@/components/modal/CalendarModal";
import { useSupabase } from "@/context/SupabaseContext";
import { useTheme } from "@/context/ThemeContext";
import { useToggleLoading } from "@/hooks/useLoading";
import useStopModal from "@/hooks/useStopModal";
import useTravelCalendar from "@/hooks/useTravelCalendar";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import { mainMenuStyles } from "@/src/styles/MainMenuStyles";
import { getTodayString } from "@/src/utils/dateUtils";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { View } from "react-native";

interface DateObject {
    dateString: string,
    day: number,
    month: number,
    timestamp: number,
    year: number
}

export default function HomePage() {
    const { supabaseClient: supabase } = useSupabase()

    const { theme } = useTheme()

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
        <View style={mainMenuStyles[theme].container}>
            <View style={mainMenuStyles[theme].listContainer}>
                {loading == true || !supabase ? (
                    <LoadingScreen></LoadingScreen>
                ) : (
                    <GroupedDataDisplay data={travelAtDate} currentDate={selectedDate}></GroupedDataDisplay>
                )}
            </View>
            <Button
                style={[buttonStyles[theme].addButton, { flex: 0 }]}
                textStyle={buttonStyles[theme].addButtonText}
                onPress={() => openCalendarModal()}
            >
                View Calendar
            </Button>
            <CalendarModal
                dates={dates}
                markedDates={markedDates}
                currentSelectedDate={selectedDate}
                modalElements={{
                    isModalVisible: showCalendarModal,
                    onClose: closeCalendarModal,
                    onSelect: onDayPress
                }}
            />
        </View>
    );
};