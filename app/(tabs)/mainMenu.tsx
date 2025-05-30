import Button from "@/components/BaseButton"
import GroupedDataDisplay from "@/components/GroupedTravelsDisplay"
import LoadingScreen from "@/components/LoadingScreen"
import CalendarModal from "@/components/modal/CalendarModal"
import { useSupabase } from "@/context/SupabaseContext"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useToggleLoading } from "@/hooks/useLoading"
import useStopModal from "@/hooks/useStopModal"
import useTravelCalendar from "@/hooks/useTravelCalendar"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { mainMenuStyles } from "@/src/styles/MainMenuStyles"
import { DataItemWithNewKey, getGroupedData } from "@/src/utils/dataUtils"
import { getTodayString } from "@/src/utils/dateUtils"
import { useFocusEffect } from "@react-navigation/native"
import React, { useEffect, useMemo, useState } from "react"
import { View } from "react-native"

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

    const { laps, getAllLaps } = useGetTravelData()

    const [groupedData, setGroupedData] = useState<Record<string, DataItemWithNewKey[]>>()

    const {
        showStopModal: showCalendarModal,
        openStopModal: openCalendarModal,
        closeStopModal: closeCalendarModal
    } = useStopModal()

    const markedDates = useMemo(() => {
        const marked: any = {}

        dates.forEach(date => {
            marked[date] = {
                ...marked[date],
                marked: true,
                color: '#dcf8c6',
            }
        })

        marked[selectedDate] = {
            ...marked[selectedDate],
            selected: true,
            selectedColor: '#00adf5',
            selectedTextColor: 'white',
        }

        return marked
    }, [selectedDate, dates])

    const onDayPress = (day: DateObject) => {
        toggleLoading()
        setSelectedDate(day.dateString)
        closeCalendarModal()
    }

    useEffect(() => {
        setSelectedDate(getTodayString())
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getDates()
        }, [])
    )

    useFocusEffect(
        React.useCallback(() => {
            getAllLaps()
        }, [dates])
    )

    useFocusEffect(
        React.useCallback(() => {
            const data = getGroupedData(travelAtDate, laps)
            setGroupedData(data)
        }, [travelAtDate, laps])
    )

    useFocusEffect(
        React.useCallback(() => {
            getTravelAtDate()
        }, [selectedDate])
    )

    return (
        <View style={mainMenuStyles[theme].container}>
            <View style={mainMenuStyles[theme].listContainer}>
                {loading == true || !supabase || !groupedData ? (
                    <LoadingScreen></LoadingScreen>
                ) : (
                    <GroupedDataDisplay data={groupedData} currentDate={selectedDate}></GroupedDataDisplay>
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
    )
}