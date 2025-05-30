import AnnotationContent from '@/components/AnnotationContent'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import LoadingScreen from '@/components/LoadingScreen'
import { useTravelContext } from '@/context/PageContext'
import { useTheme } from '@/context/ThemeContext'
import useGetTravelData from '@/hooks/useGetTravelData'
import { travelDetailStyles } from '@/src/styles/TravelDetailStyles'
import { DataItem } from '@/src/types/Travels'
import { getSimpleCentroid } from '@/src/utils/mapUtils'
import { Camera, MapView, MarkerView } from '@maplibre/maplibre-react-native'
import { useFocusEffect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

const { width: screenWidth } = Dimensions.get("screen")

const formatDurationMinutes = (milliseconds: number): string => {
    if (isNaN(milliseconds) || milliseconds < 0) {
        return 'N/A'
    }
    const minutes = Math.floor(milliseconds / (1000 * 60))
    return `${minutes} mins`
}

const formatDurationHoursMinutes = (milliseconds: number): string => {
    if (isNaN(milliseconds) || milliseconds < 0) {
        return 'N/A'
    }
    const totalMinutes = Math.floor(milliseconds / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m / ${totalMinutes}m`
}

export default function TravelDetail() {
    const { theme } = useTheme()

    const { selectedTravelItems } = useTravelContext()

    const {
        fullVehicleTypes,
        travelLaps, getTravelLaps,
        refetchTravelData
    } = useGetTravelData()

    const [dataToUse, setDataToUse] = useState<DataItem[]>([])

    if (!selectedTravelItems) {
        return (
            <LoadingScreen></LoadingScreen>
        )
    }

    useEffect(() => {
        setDataToUse(selectedTravelItems)

        const allLaps = selectedTravelItems.map(travel => travel.id)
        getTravelLaps(allLaps)
    }, [selectedTravelItems])

    useFocusEffect(
        React.useCallback(() => {
            setDataToUse(selectedTravelItems)
        }, [selectedTravelItems])
    )

    useFocusEffect(
        React.useCallback(() => {
            refetchTravelData()
        }, [])
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

    const lapLatLon = travelLaps
        ?.filter(lap => lap.stop_id !== null && lap.stop_id.lon && lap.stop_id.lat)
        .map(lap => (
            {
                id: "lap",
                stop: lap.stop_id,
                name: lap.stop_id?.name,
                coords: [lap.stop_id?.lon, lap.stop_id?.lat],
                time: lap.time,
            }
        )) || []

    const fullLatLon = [...stopLatLon, ...lapLatLon]

    const validCoords = fullLatLon
        .map(data => data?.coords)
        .filter((coords): coords is number[] => coords !== undefined && coords !== null)

    const centerLatLon = getSimpleCentroid(validCoords)

    let totalOnRoadMilliseconds = 0
    let earliestStartMillis: number | null = null
    let latestEndMillis: number | null = null
    let validTripCount = 0
    let sumInitialStopDurationMilliseconds = 0
    let uniqueVehicles = new Set<string>()
    let uniqueRoutes = new Set<string>()
    let uniqueOrigins = new Set<string>()
    let uniqueDestinations = new Set<string>()
    let tripsByType: { [key: string]: number } = {}


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
                    validTripCount++

                    if (earliestStartMillis === null || departureDate.getTime() < earliestStartMillis) {
                        earliestStartMillis = departureDate.getTime()
                    }

                    if (latestEndMillis === null || finalArrivalDate.getTime() > latestEndMillis) {
                        latestEndMillis = finalArrivalDate.getTime()
                    }

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


            if (trip.vehicle_code) {
                uniqueVehicles.add(trip.vehicle_code)
            }
            if (trip.routes?.name) {
                uniqueRoutes.add(trip.routes.name)
            }
            if (trip.first_stop_id?.name) {
                uniqueOrigins.add(trip.first_stop_id.name)
            }
            if (trip.last_stop_id?.name) {
                uniqueDestinations.add(trip.last_stop_id.name)
            }

            if (trip.types?.name) {
                tripsByType[trip.types.name] = (tripsByType[trip.types.name] || 0) + 1
            }


        } catch (error) {
            console.error(`Error processing trip ID ${trip.id || 'unknown'}:`, error)
        }
    })


    let totalCalendarSpanMilliseconds = 0
    if (earliestStartMillis !== null && latestEndMillis !== null && latestEndMillis > earliestStartMillis) {
        totalCalendarSpanMilliseconds = latestEndMillis - earliestStartMillis
    }

    let efficiencyPercentage = 0
    if (totalCalendarSpanMilliseconds > 0) {
        efficiencyPercentage = (totalOnRoadMilliseconds / totalCalendarSpanMilliseconds) * 100
    }

    const uniqueVehiclesList = [...uniqueVehicles.values()]
    const uniqueRoutesList = [...uniqueRoutes.values()]
    const uniqueOriginsList = [...uniqueOrigins.values()]
    const uniqueDestinationsList = [...uniqueDestinations.values()]

    return (
        <CollapsibleHeaderPage>
            <View style={travelDetailStyles[theme].container}>
                <View style={travelDetailStyles[theme].card}>
                    <Text style={travelDetailStyles[theme].cardTitle}>Efficiency Overview</Text>

                    <View style={travelDetailStyles[theme].detailRow}>
                        <Text style={travelDetailStyles[theme].label}>Total Time Span:</Text>
                        <Text style={travelDetailStyles[theme].valueText}>{formatDurationMinutes(totalCalendarSpanMilliseconds)}</Text>
                    </View>

                    <View style={travelDetailStyles[theme].detailRow}>
                        <Text style={travelDetailStyles[theme].label}>Total On-Road Time:</Text>
                        <Text style={travelDetailStyles[theme].valueText}>{formatDurationMinutes(totalOnRoadMilliseconds)}</Text>
                    </View>

                    <View style={travelDetailStyles[theme].detailRow}>
                        <Text style={travelDetailStyles[theme].label}>Calculated Efficiency:</Text>
                        <Text style={[travelDetailStyles[theme].valueText, travelDetailStyles[theme].specialValue]}>
                            {efficiencyPercentage.toFixed(2)}%
                        </Text>
                    </View>
                </View>

                {sortedData.length > 0 && (
                    <View style={travelDetailStyles[theme].card}>
                        <Text style={travelDetailStyles[theme].cardTitle}>Individual Trip Durations</Text>
                        {sortedData.sort(data => data.id).map((trip) => {
                            try {
                                const departureDate = new Date(trip.bus_initial_departure)
                                const finalArrivalDate = new Date(trip.bus_final_arrival)
                                const durationMillis = finalArrivalDate.getTime() - departureDate.getTime()
                                const durationString = formatDurationHoursMinutes(durationMillis)

                                const tripIdentifier = `${trip.vehicle_code || 'N/A'} - ${trip.routes?.name || 'N/A'}`

                                return (
                                    <View key={trip.id} style={travelDetailStyles[theme].detailRow}>
                                        <Text style={travelDetailStyles[theme].label}>{tripIdentifier}:</Text>
                                        <Text style={travelDetailStyles[theme].valueText}>{durationString}</Text>
                                    </View>
                                )
                            } catch (error) {
                                console.error(`Error calculating duration for trip ID ${trip.id || 'unknown'}:`, error)
                                return (
                                    <View key={trip.id} style={travelDetailStyles[theme].detailRow}>
                                        <Text style={travelDetailStyles[theme].label}>Trip ID {trip.id || 'N/A'} Duration:</Text>
                                        <Text style={travelDetailStyles[theme].valueText}>Calculation Error</Text>
                                    </View>
                                )
                            }
                        })}
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

                <View style={travelDetailStyles[theme].card}>
                    <Text style={travelDetailStyles[theme].cardTitle}>Activity Counts</Text>

                    <View style={travelDetailStyles[theme].detailRow}>
                        <Text style={travelDetailStyles[theme].label}>Total Trips Processed:</Text>
                        <Text style={travelDetailStyles[theme].valueText}>{sortedData.length}</Text>
                    </View>

                    <View style={travelDetailStyles[theme].detailRow}>
                        <Text style={travelDetailStyles[theme].label}>Valid Trips for Duration:</Text>
                        <Text style={travelDetailStyles[theme].valueText}>{validTripCount}</Text>
                    </View>

                    {Object.keys(tripsByType).length > 0 && (
                        <View style={travelDetailStyles[theme].detailRow}>
                            <Text style={travelDetailStyles[theme].label}>Trips by Type:</Text>
                            <View style={travelDetailStyles[theme].value}>
                                {Object.entries(tripsByType).map(([type, count]) => (
                                    <Text key={type} style={[travelDetailStyles[theme].valueText, travelDetailStyles[theme].specialValue]}>{type}: {count}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {(uniqueVehiclesList.length > 0 || uniqueRoutesList.length > 0 || uniqueOriginsList.length > 0 || uniqueDestinationsList.length > 0) && (
                    <View style={travelDetailStyles[theme].card}>
                        <Text style={travelDetailStyles[theme].cardTitle}>Unique Items</Text>

                        {uniqueVehiclesList.length > 0 && (
                            <View style={travelDetailStyles[theme].detailRow}>
                                <Text style={travelDetailStyles[theme].label}>Unique Vehicles ({uniqueVehiclesList.length}):</Text>
                                <View style={travelDetailStyles[theme].value}>
                                    {uniqueVehiclesList.map((item, index) => (
                                        <Text key={index} style={[travelDetailStyles[theme].valueText, travelDetailStyles[theme].specialValue]}>{item}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {uniqueRoutesList.length > 0 && (
                            <View style={travelDetailStyles[theme].detailRow}>
                                <Text style={travelDetailStyles[theme].label}>Unique Routes ({uniqueRoutesList.length}):</Text>
                                <View style={travelDetailStyles[theme].value}>
                                    {uniqueRoutesList.map((item, index) => (
                                        <Text key={index} style={travelDetailStyles[theme].valueText}>{item}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {uniqueOriginsList.length > 0 && (
                            <View style={travelDetailStyles[theme].detailRow}>
                                <Text style={travelDetailStyles[theme].label}>Unique Origins ({uniqueOriginsList.length}):</Text>
                                <View style={travelDetailStyles[theme].value}>
                                    {uniqueOriginsList.map((item, index) => (
                                        <Text key={index} style={travelDetailStyles[theme].valueText}>{item}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {uniqueDestinationsList.length > 0 && (
                            <View style={travelDetailStyles[theme].detailRow}>
                                <Text style={travelDetailStyles[theme].label}>Unique Destinations ({uniqueDestinationsList.length}):</Text>
                                <View style={travelDetailStyles[theme].value}>
                                    {uniqueDestinationsList.map((item, index) => (
                                        <Text key={index} style={travelDetailStyles[theme].valueText}>{item}</Text>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}
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