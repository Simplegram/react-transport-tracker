import AnnotationContent from '@/components/AnnotationContent'
import TypeButton from '@/components/button/TypeButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Container from '@/components/Container'
import Input from '@/components/input/Input'
import LoadingScreen from '@/components/LoadingScreen'
import MapDisplay from '@/components/MapDisplay'
import IndividualTravelDetailCard from '@/components/travel/IndividualTravelDetailCard'
import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import useGetTravelData from '@/hooks/useGetTravelData'
import useTravelDetail from '@/hooks/useTravelDetail'
import { colors } from '@/src/const/color'
import { travelDetailStyles } from '@/src/styles/TravelDetailStyles'
import { DataItem, Stop } from '@/src/types/Travels'
import { formatMsToMinutes, sumTimesToMs, timeToEpoch } from '@/src/utils/dateUtils'
import { getSimpleCentroid } from '@/src/utils/mapUtils'
import { LineLayer, MarkerView, ShapeSource } from '@maplibre/maplibre-react-native'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native'

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

    const {
        travelTimes, getAllTravelTimes,
        routeTrace, getRouteTrace
    } = useTravelDetail()

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

    useEffect(() => {
        console.log(routeTrace)
    }, [routeTrace])

    useFocusEffect(
        React.useCallback(() => {
            refetchTravelData()

            const allLaps = selectedTravelItems.map(travel => travel.id)
            getTravelLaps(allLaps)
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            if (travelLaps) {
                const sortedLaps = travelLaps.sort((a, b) => {
                    const epochA = timeToEpoch(a.time)
                    const epochB = timeToEpoch(b.time)
                    return epochA - epochB
                })
                    .filter((lap) => lap.lon && lap.lat)
                    .filter((lap) =>
                        (timeToEpoch(lap.time) > timeToEpoch(dataToUse[0].bus_initial_departure))
                        &&
                        (timeToEpoch(lap.time) < timeToEpoch(dataToUse[dataToUse.length - 1].bus_final_arrival))
                    )

                let joinedCoordinates: string = ''
                if (sortedLaps) {
                    const coordinateStrings = sortedLaps.map(lap => {
                        return `${lap.lon},${lap.lat}`
                    })

                    if(dataToUse[0].first_stop_id.lon && dataToUse[0].first_stop_id.lat)
                    coordinateStrings.unshift(`${dataToUse[0].first_stop_id.lon},${dataToUse[0].first_stop_id.lat}`)

                    if(dataToUse[dataToUse.length - 1].last_stop_id.lon && dataToUse[dataToUse.length - 1].last_stop_id.lat)
                    coordinateStrings.push(`${dataToUse[dataToUse.length - 1].last_stop_id.lon},${dataToUse[dataToUse.length - 1].last_stop_id.lat}`)

                    joinedCoordinates = coordinateStrings.join(';')
                }

                console.log(joinedCoordinates)

                getRouteTrace(joinedCoordinates)
            }
        }, [travelLaps])
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
        if (!isFinite(efficiencyPercentage)) {
            efficiencyPercentage = 0
        }
    }

    const timeDiff = formatMsToMinutes(totalOnRoadMilliseconds - averageRouteDurationMilliseconds, true)
    const diffColor = Math.sign(totalOnRoadMilliseconds - averageRouteDurationMilliseconds) < 0 ? colors.greenPositive_100 : colors.redCancel_100

    return (
        <CollapsibleHeaderPage headerText='Travel Detail'>
            <View style={travelDetailStyles[theme].container}>
                <View style={{
                    gap: 15,
                }}>
                    <Input.TitleDivide>Duration Overview</Input.TitleDivide>

                    <Container.DetailRow>
                        <Input.Label>Estimated On-Road Duration:</Input.Label>
                        <Input.ValueText>{formatMsToMinutes(averageRouteDurationMilliseconds)}</Input.ValueText>
                    </Container.DetailRow>

                    <Container.DetailRow>
                        <Input.Label>Real On-Road Duration:</Input.Label>
                        <View style={{
                            gap: 5,
                            flexDirection: 'row',
                        }}>
                            <Input.ValueText>{formatMsToMinutes(totalOnRoadMilliseconds)}</Input.ValueText>
                            <Input.ValueText style={{ color: diffColor }}>{`(${timeDiff})`}</Input.ValueText>
                        </View>
                    </Container.DetailRow>

                    <Container.DetailRow>
                        <Input.Label>Travel Score:</Input.Label>
                        <Input.ValueText style={travelDetailStyles[theme].specialValue}>
                            {efficiencyPercentage.toFixed(1)}%
                        </Input.ValueText>
                    </Container.DetailRow>

                    <Input>
                        <TypeButton.Block
                            type={type}
                            onPress={setType}
                        />
                    </Input>
                </View>

                {sortedData.length > 0 && (
                    <View style={{
                        gap: 15,
                    }}>
                        <Input.TitleDivide>Individual Travel Detail</Input.TitleDivide>
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
                    <MapDisplay
                        centerCoordinate={centerLatLon ? [centerLatLon?.center.lon, centerLatLon?.center.lat] : [0, 0]}
                        zoomLevel={centerLatLon ? centerLatLon.zoom : 6}

                        rotateEnabled={false}
                    >
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
                        {routeTrace && (
                            <ShapeSource
                                id="source1"
                                lineMetrics
                                shape={{
                                    type: "Feature",
                                    geometry: {
                                        type: 'LineString',
                                        coordinates: routeTrace
                                    }
                                }}
                            >
                                <LineLayer id="layer1" style={{
                                    lineColor: colors.primary,
                                    lineCap: "round",
                                    lineJoin: "round",
                                    lineWidth: 4,
                                }} />
                            </ShapeSource>
                        )}
                    </MapDisplay>
                </View>
            </View>
        </CollapsibleHeaderPage >
    )
}