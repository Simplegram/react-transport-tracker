import AnnotationContent from '@/components/AnnotationContent'
import TypeButton from '@/components/button/TypeButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import LoadingScreen from '@/components/LoadingScreen'
import IndividualTravelDetailCard from '@/components/travel/IndividualTravelDetailCard'
import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import useGetTravelData from '@/hooks/useGetTravelData'
import useTravelDetail from '@/hooks/useTravelDetail'
import { colors } from '@/src/const/color'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { travelDetailStyles } from '@/src/styles/TravelDetailStyles'
import { DataItem, Stop, TravelTimeData } from '@/src/types/Travels'
import { formatMsToMinutes, sumTimesToMs } from '@/src/utils/dateUtils'
import { getSimpleCentroid } from '@/src/utils/mapUtils'
import { Camera, MapView, MarkerView } from '@maplibre/maplibre-react-native'
import { useFocusEffect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

const { width: screenWidth } = Dimensions.get("screen")

interface LapLatLon {
    id: string
    stop: Stop | null
    name: string | undefined
    coords: number[]
    time: string
}

const typeIndex = {
    best: 'min_top_5_shortest',
    average: 'avg_travel_time',
    worst: 'max_top_5_longest'
}

export default function TravelDetail() {
    const { theme } = useTheme()

    const { selectedTravelItems } = useTravelContext()

    const {
        fullVehicleTypes,
        travelLaps, getTravelLaps,
        refetchTravelData,
    } = useGetTravelData()

    const { travelTimes, getAllTravelTimes } = useTravelDetail()

    const [dataToUse, setDataToUse] = useState<DataItem[]>([])
    const [type, setType] = useState<'best' | 'average' | 'worst'>('average')

    if (!selectedTravelItems) {
        return (
            <LoadingScreen></LoadingScreen>
        )
    }

    useEffect(() => {
        setDataToUse(selectedTravelItems)

        const allLaps = selectedTravelItems.map(travel => travel.id)
        getTravelLaps(allLaps)

        const inputItems = selectedTravelItems.map((travelItem) => {
            return {
                routeId: travelItem.routes.id,
                directionId: travelItem.directions.id,
                startStopId: travelItem.first_stop_id.id,
                endStopId: travelItem.last_stop_id.id
            }
        })
        getAllTravelTimes(inputItems)
    }, [selectedTravelItems])

    useFocusEffect(
        React.useCallback(() => {
            refetchTravelData()

            const allLaps = selectedTravelItems.map(travel => travel.id)
            getTravelLaps(allLaps)
        }, [])
    )

    useFocusEffect(
        React.useCallback(() => {
            setDataToUse(selectedTravelItems)
        }, [selectedTravelItems])
    )
    
    if (!travelTimes) return (
        <LoadingScreen />
    )

    const sortedData = [...dataToUse].sort((a, b) => {
        const dateAInitialArrival = a.bus_initial_arrival ? new Date(a.bus_initial_arrival).getTime() : a.bus_initial_departure ? new Date(a.bus_initial_departure).getTime() : null
        const dateBInitialArrival = b.bus_initial_arrival ? new Date(b.bus_initial_arrival).getTime() : b.bus_initial_departure ? new Date(b.bus_initial_departure).getTime() : null

        if (dateAInitialArrival !== null && dateBInitialArrival !== null) {
            return dateAInitialArrival - dateBInitialArrival
        }

        const dateACreatedAt = new Date(a.created_at).getTime()
        const dateBCreatedAt = new Date(b.created_at).getTime()

        return dateACreatedAt - dateBCreatedAt
    })

    const stopLatLon = sortedData.flatMap(travel => {
        const coords = []

        if (travel.first_stop_id && travel.first_stop_id.lat && travel.first_stop_id.lon) {
            coords.push(
                {
                    id: "stop",
                    stop: travel.first_stop_id,
                    name: travel.first_stop_id.name,
                    coords: [travel.first_stop_id.lon, travel.first_stop_id.lat],
                    time: travel.bus_initial_arrival || travel.bus_initial_departure || null
                }
            )
        }

        if (travel.last_stop_id && travel.last_stop_id.lat && travel.last_stop_id.lon) {
            coords.push(
                {
                    id: "stop",
                    stop: travel.last_stop_id,
                    name: travel.last_stop_id.name,
                    coords: [travel.last_stop_id.lon, travel.last_stop_id.lat],
                    time: travel.bus_final_arrival || null
                }
            )
        }

        return coords
    })

    let lapLatLon: LapLatLon[] = []
    if (travelLaps)
        lapLatLon = travelLaps
            .filter(lap => (lap.stop_id !== null && lap.stop_id.lon && lap.stop_id.lat) || (lap.lon && lap.lat))
            .map(lap => {
                let coords: number[]
                if (lap.stop_id && lap.stop_id.lon && lap.stop_id.lat) {
                    coords = [lap.stop_id.lon, lap.stop_id.lat]
                }
                else if (lap.lon && lap.lat) coords = [lap.lon, lap.lat]
                else coords = []

                return {
                    id: "lap",
                    stop: lap.stop_id,
                    name: lap.stop_id?.name,
                    coords: coords,
                    time: lap.time,
                }
            })

    const fullLatLon = [...stopLatLon, ...lapLatLon]

    const validCoords = fullLatLon
        .map(data => data?.coords)
        .filter((coords): coords is number[] => coords !== undefined && coords !== null)

    const centerLatLon = getSimpleCentroid(validCoords)

    const averageTravelTimes = Object.values(travelTimes).map(
        (timeData) => timeData[typeIndex[type]]
    )

    const extractedTimes = Object.keys(travelTimes).reduce((acc, routeId) => {
        const timeData = travelTimes[routeId]
        const selectedTime = timeData[typeIndex[type]]

        acc[routeId] = selectedTime

        return acc
    }, {} as { [key: string]: any })

    let averageRouteDurationMilliseconds = sumTimesToMs(averageTravelTimes)
    let totalOnRoadMilliseconds = 0
    let sumInitialStopDurationMilliseconds = 0

    sortedData.forEach(trip => {
        try {
            const initialArrivalDate = new Date(trip.bus_initial_arrival)
            const departureDate = new Date(trip.bus_initial_departure)
            const finalArrivalDate = new Date(trip.bus_final_arrival)

            const initialArrivalValid = !isNaN(initialArrivalDate.getTime())
            const departureValid = !isNaN(departureDate.getTime())
            const finalArrivalValid = !isNaN(finalArrivalDate.getTime())

            if (departureValid && finalArrivalValid) {
                if (finalArrivalDate.getTime() >= departureDate.getTime()) {
                    totalOnRoadMilliseconds += finalArrivalDate.getTime() - departureDate.getTime()
                } else {
                    console.warn(`Trip ID ${trip.id}: Final arrival (${trip.bus_final_arrival}) is before initial departure (${trip.bus_initial_departure}). Excluding from duration calcs.`)
                }
            } else {
                console.warn(`Trip ID ${trip.id}: Invalid departure or final arrival date.`)
            }


            if (initialArrivalValid && departureValid) {
                if (departureDate.getTime() >= initialArrivalDate.getTime()) {
                    sumInitialStopDurationMilliseconds += departureDate.getTime() - initialArrivalDate.getTime()
                } else {
                    console.warn(`Trip ID ${trip.id}: Initial departure (${trip.bus_initial_departure}) is before initial arrival (${trip.bus_initial_arrival}). Excluding from initial stop duration calc.`)
                }
            } else {
                console.warn(`Trip ID ${trip.id}: Invalid initial arrival or departure date for stop time calc.`)
            }

        } catch (error) {
            console.error(`Error processing trip ID ${trip.id || 'unknown'}:`, error)
        }
    })

    let efficiencyPercentage = 0
    if (averageRouteDurationMilliseconds > 0) {
        efficiencyPercentage = (averageRouteDurationMilliseconds / totalOnRoadMilliseconds) * 100
    }

    const timeDiff = formatMsToMinutes(totalOnRoadMilliseconds - averageRouteDurationMilliseconds, true)
    const diffColor = Math.sign(totalOnRoadMilliseconds - averageRouteDurationMilliseconds) < 0 ? colors.greenPositive_100 : colors.redCancel_100

    return (
        <CollapsibleHeaderPage headerText='Travel Detail'>
            <View style={travelDetailStyles[theme].container}>
                <View style={{
                    gap: 15,
                }}>
                    <Text style={travelDetailStyles[theme].cardTitle}>Duration Overview</Text>

                    <View style={travelDetailStyles[theme].detailRow}>
                        <Text style={travelDetailStyles[theme].label}>Estimated On-Road Duration:</Text>
                        <Text style={travelDetailStyles[theme].valueText}>{formatMsToMinutes(averageRouteDurationMilliseconds)}</Text>
                    </View>

                    <View style={travelDetailStyles[theme].detailRow}>
                        <Text style={travelDetailStyles[theme].label}>Real On-Road Duration:</Text>
                        <View style={{
                            gap: 5,
                            flexDirection: 'row',
                        }}>
                            <Text style={travelDetailStyles[theme].valueText}>{formatMsToMinutes(totalOnRoadMilliseconds)}</Text>
                            <Text style={[travelDetailStyles[theme].valueText, { color: diffColor }]}>{`(${timeDiff})`}</Text>
                        </View>
                    </View>

                    <View style={travelDetailStyles[theme].detailRow}>
                        <Text style={travelDetailStyles[theme].label}>Travel Score:</Text>
                        <Text style={[travelDetailStyles[theme].valueText, travelDetailStyles[theme].specialValue]}>
                            {efficiencyPercentage.toFixed(1)}%
                        </Text>
                    </View>

                    <View style={inputElementStyles[theme].inputGroup}>
                        <View style={{ gap: 10, flexDirection: 'row' }}>
                            <TypeButton
                                label='Best'
                                onPress={() => setType('best')}
                                typeSelected={type === 'best'}
                            />
                            <TypeButton
                                label='Average'
                                onPress={() => setType('average')}
                                typeSelected={type === 'average'}
                            />
                            <TypeButton
                                label='Worst'
                                onPress={() => setType('worst')}
                                typeSelected={type === 'worst'}
                            />
                        </View>
                    </View>
                </View>

                {sortedData.length > 0 && (
                    <View style={{
                        gap: 15,
                    }}>
                        <Text style={travelDetailStyles[theme].cardTitle}>Individual Travel Detail</Text>
                        {sortedData.sort(data => data.id).map((travel, index) => (
                            <IndividualTravelDetailCard
                                key={index}
                                travel={travel}
                                travelTime={extractedTimes[travel.routes.id]}
                            />
                        ))}
                    </View>
                )}

                <View style={[travelDetailStyles[theme].card, { height: screenWidth * 0.95, padding: 0, overflow: 'hidden' }]}>
                    <MapView
                        style={{ flex: 1, overflow: 'hidden' }}
                        rotateEnabled={false}
                        mapStyle={process.env.EXPO_PUBLIC_MAP_STYLE}
                    >
                        {centerLatLon && (
                            <Camera
                                centerCoordinate={[centerLatLon?.center.lon, centerLatLon?.center.lat]}
                                zoomLevel={centerLatLon?.zoom}
                            />
                        )}
                        {fullLatLon && fullLatLon
                            .filter(data =>
                                data.coords !== undefined &&
                                Array.isArray(data.coords) &&
                                data.coords.every(coord => typeof coord === 'number')
                            )
                            .map((data, index) => (
                                <MarkerView
                                    key={index}
                                    coordinate={data.coords as [number, number]}
                                >
                                    <AnnotationContent
                                        fullVehicleTypes={fullVehicleTypes}
                                        data_id={data.id}
                                        title={data.name || ''}
                                        stop={data.stop}
                                        time={data.time}
                                    />
                                </MarkerView>
                            ))}
                    </MapView>
                </View>
            </View>
        </CollapsibleHeaderPage>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 15,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        gap: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
        color: '#555',
    },
    detailRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderRadius: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    value: {},
    valueText: {
        fontSize: 14,
        color: '#555',
        flexShrink: 1,
        fontWeight: 'bold',
    },
    specialValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
    },
})