import Button from "@/components/button/BaseButton"
import Container from "@/components/Container"
import Input from "@/components/input/Input"
import LoadingScreen from "@/components/LoadingScreen"
import CalendarModal from "@/components/modal/CalendarModal"
import GroupedDataDisplay from "@/components/travel/GroupedTravelsDisplay"
import { useSupabase } from "@/context/SupabaseContext"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useToggleLoading } from "@/hooks/useLoading"
import useModalHandler from "@/hooks/useModalHandler"
import useTravelCalendar from "@/hooks/useTravelCalendar"
import { DataItemWithNewKey, getGroupedData } from "@/src/utils/dataUtils"
import { getDateString, getTimeString } from "@/src/utils/dateUtils"
import { router, useFocusEffect } from "expo-router"
import moment from "moment"
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

    const { getTheme } = useTheme()
    const theme = getTheme()

    const {
        travelAtDate, getTravelAtDate, getDates,
        dates, selectedDate, setSelectedDate,
    } = useTravelCalendar()

    const { loading, setLoading, toggleLoading } = useToggleLoading(200)

    const { laps, getAllLaps } = useGetTravelData()

    const [groupedData, setGroupedData] = useState<Record<string, DataItemWithNewKey[]>>()

    const [currentTime, setCurrentTime] = useState<string>(getTimeString())

    useEffect(() => {
        setInterval(() => {
            setCurrentTime(getTimeString())
        }, 1000)
    }, [])

    const {
        showModal: showCalendarModal,
        openModalWithSearch: openCalendarModal,
        closeModal: closeCalendarModal
    } = useModalHandler()

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
        if (day.dateString !== selectedDate) toggleLoading()
        setSelectedDate(day.dateString)
        closeCalendarModal()
    }

    const refetchTravels = async () => {
        await getDates()
        await getAllLaps()
        await getTravelAtDate()
    }

    useEffect(() => {
        setSelectedDate(getDateString())
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
            setLoading(false)
        }, [travelAtDate, laps])
    )

    useFocusEffect(
        React.useCallback(() => {
            getTravelAtDate()
        }, [selectedDate])
    )

    return (
        <Container>
            <View style={{
                justifyContent: 'flex-end',

                borderColor: theme.palette.borderColor,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    paddingHorizontal: 5,
                }}>
                    <View>
                        <Input.Header>{moment(getDateString()).format('dddd')}</Input.Header>
                        <Input.Header>{moment(getDateString()).format('LL')}</Input.Header>
                    </View>
                    <Input.Header>{currentTime}</Input.Header>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                {loading || !supabase || !groupedData ? (
                    <LoadingScreen></LoadingScreen>
                ) : (
                    <GroupedDataDisplay data={groupedData} currentDate={selectedDate} refetch={() => {
                        setLoading(true)
                        refetchTravels()
                    }} />
                )}
            </View>
            <View style={{
                gap: 8,
                width: '100%',
                flexDirection: 'row',
            }}>
                <Button.Add label="Time Estimation" onPress={() => router.push("main/estimate")} />
                <Button.Add label="View Calendar" onPress={() => openCalendarModal()} />
            </View>
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
        </Container>
    )
}