import Button from "@/components/BaseButton"
import EditTravelDirectionModal from "@/components/modal/travelModal/EditTravelDirectionModal"
import EditTravelRouteModal from "@/components/modal/travelModal/EditTravelRouteModal"
import EditTravelStopModal from "@/components/modal/travelModal/EditTravelStopModal"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import useModalHandler from "@/hooks/useModalHandler"
import useTravelDetail from "@/hooks/useTravelDetail"
import { colors } from "@/src/const/color"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { mainMenuStyles } from "@/src/styles/MainMenuStyles"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { addTime, getTimeString, timeToMinutes } from "@/src/utils/dateUtils"
import { useFocusEffect } from "expo-router"
import React, { useState } from "react"
import { Pressable, Text, TouchableOpacity, View } from "react-native"

interface TravelTimeInput {
    route_id: number | undefined
    direction_id: number | undefined
    first_stop_id: number | undefined
    last_stop_id: number | undefined
    estimate_type: 'best' | 'average' | 'worst'
}

interface TypeButtonProps {
    onPress: () => void
    children: React.ReactNode
}

export function TypeButton({ onPress, children }: TypeButtonProps) {
    const { theme } = useTheme()

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                travelDetailStyles[theme].detailRow,
                { flex: 1, alignItems: 'center' }
            ]}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    )
}

const typeIndex = {
    best: 'min_top_5_shortest',
    average: 'avg_travel_time',
    worst: 'max_top_5_longest'
}

export default function EstimationPage() {
    const { theme } = useTheme()

    const { stops, routes, directions } = useGetTravelData()

    const { averageTime, getTravelTime } = useTravelDetail()

    const {
        showModal: showRouteModal,
        searchQuery: routeSearchQuery,
        setSearchQuery: setRouteSearchQuery,
        openModalWithSearch: openRouteModal,
        closeModal: closeRouteModal
    } = useModalHandler()

    const {
        showModal: showDirectionModal,
        searchQuery: directionSearchQuery,
        setSearchQuery: setDirectionSearchQuery,
        openModalWithSearch: openDirectionModal,
        closeModal: closeDirectionModal
    } = useModalHandler()

    const {
        showModal: showStopModal,
        editingField: stopEditingField,
        searchQuery: stopSearchQuery,
        setSearchQuery: setStopSearchQuery,
        openModalWithSearch: openStopModal,
        closeModal: closeStopModal
    } = useModalHandler()

    const [travelTimes, setTravelTimes] = useState<string>()
    const [input, setInput] = useState<TravelTimeInput>({
        route_id: undefined,
        direction_id: undefined,
        first_stop_id: undefined,
        last_stop_id: undefined,
        estimate_type: 'average'
    })

    useFocusEffect(
        React.useCallback(() => {
            if (averageTime) {
                const estimatedTime = timeToMinutes(averageTime[typeIndex[input.estimate_type]])
                setTravelTimes(estimatedTime)
            }
        }, [averageTime])
    )

    const handleRouteSelect = (routeId: number) => {
        setInput({ ...input, route_id: routeId })
        closeRouteModal()
    }

    const handleDirectionSelect = (directionId: number) => {
        setInput({ ...input, direction_id: directionId })
        closeDirectionModal()
    }

    const handleStopSelect = (stopId: number) => {
        if (stopEditingField) {
            setInput({ ...input, [stopEditingField]: stopId })
        }
        closeStopModal()
    }

    const handleOnSubmit = async () => {
        if (input.route_id && input.direction_id && input.first_stop_id && input.last_stop_id) {
            await getTravelTime(input.route_id, input.direction_id, input.first_stop_id, input.last_stop_id)
        }
    }

    const route = routes.find(item => item.id === input.route_id)
    const tripIdentifier = `${route && route.code} | ${route && route.name}`

    const first_stop = stops.find(stop => stop.id === input.first_stop_id)
    const last_stop = stops.find(stop => stop.id === input.last_stop_id)
    const stopString = `${first_stop && first_stop.name} to ${last_stop && last_stop.name}`

    return (
        <View style={mainMenuStyles[theme].container}>
            <View style={{
                flex: 1,
            }}>
                <View style={travelDetailStyles[theme].detailRow}>
                    <Text style={travelDetailStyles[theme].specialValue}>{tripIdentifier}</Text>
                    <Text style={travelDetailStyles[theme].valueText}>{stopString}</Text>
                </View>
                <View style={travelDetailStyles[theme].detailRow}>
                    <Text style={travelDetailStyles[theme].specialValue}>{`Current Time: ${getTimeString()}`}</Text>
                </View>
                <View style={travelDetailStyles[theme].detailRow}>
                    <Text style={travelDetailStyles[theme].specialValue}>{`Route Average: ${travelTimes === 'Invalid date' ? 'not found' : travelTimes}`}</Text>
                </View>
                <View style={travelDetailStyles[theme].detailRow}>
                    <Text style={travelDetailStyles[theme].specialValue}>{`Estimated Arrival: ${travelTimes && addTime(travelTimes)}`}</Text>
                </View>
            </View>
            <View style={inputElementStyles[theme].inputContainer}>
                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>Route:</Text>
                        <Pressable
                            style={inputStyles[theme].pressableInput}
                            onPress={() => openRouteModal()}>
                            <Text style={inputElementStyles[theme].insideLabel}>
                                {input.route_id ? `${routes.find(route => route.id === input.route_id)?.code || ''} | ${routes.find(route => route.id === input.route_id)?.name || ''}` : 'Select Route...'}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>Direction:</Text>
                        <Pressable
                            style={inputStyles[theme].pressableInput}
                            onPress={() => openDirectionModal()}>
                            <Text style={inputElementStyles[theme].insideLabel}>
                                {directions.find(direction => direction.id === input.direction_id)?.name || 'Select Direction...'}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>First Stop:</Text>
                        <Pressable
                            style={inputStyles[theme].pressableInput}
                            onPress={() => openStopModal('first_stop_id')}>
                            <Text style={inputElementStyles[theme].insideLabel}>{stops.find(stop => stop.id === input.first_stop_id)?.name || 'Select First Stop...'}</Text>
                        </Pressable>
                    </View>

                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>Last Stop:</Text>
                        <Pressable
                            style={inputStyles[theme].pressableInput}
                            onPress={() => openStopModal('last_stop_id')}>
                            <Text style={inputElementStyles[theme].insideLabel}>{stops.find(stop => stop.id === input.last_stop_id)?.name || 'Select Last Stop...'}</Text>
                        </Pressable>
                    </View>

                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>Estimate Type:</Text>
                        <View style={{ gap: 10, flexDirection: 'row' }}>
                            <TypeButton
                                onPress={() => setInput({ ...input, estimate_type: 'best' })}>
                                <Text style={[
                                    inputElementStyles[theme].inputLabel,
                                    input.estimate_type === 'best' && { color: theme === 'light' ? colors.primary : colors.primary_100 }
                                ]}>Best</Text>
                            </TypeButton>
                            <TypeButton onPress={() => setInput({ ...input, estimate_type: 'average' })}>
                                <Text style={[
                                    inputElementStyles[theme].inputLabel,
                                    input.estimate_type === 'average' && { color: theme === 'light' ? colors.primary : colors.primary_100 }
                                ]}>Average</Text>
                            </TypeButton>
                            <TypeButton onPress={() => setInput({ ...input, estimate_type: 'worst' })}>
                                <Text style={[
                                    inputElementStyles[theme].inputLabel,
                                    input.estimate_type === 'worst' && { color: theme === 'light' ? colors.primary : colors.primary_100 }
                                ]}>Worst</Text>
                            </TypeButton>
                        </View>
                    </View>
                </View>
            </View>

            <View style={buttonStyles[theme].buttonRow}>
                <Button
                    title='Get Estimate'
                    color='#0284f5'
                    onPress={handleOnSubmit}
                    style={buttonStyles[theme].addButton}
                    textStyle={buttonStyles[theme].addButtonText}
                />
            </View>

            <EditTravelDirectionModal
                directions={directions}
                isModalVisible={showDirectionModal}
                searchQuery={directionSearchQuery}
                setSearchQuery={setDirectionSearchQuery}
                onSelect={handleDirectionSelect}
                onClose={closeDirectionModal}
            />

            <EditTravelRouteModal
                routes={routes}
                isModalVisible={showRouteModal}
                searchQuery={routeSearchQuery}
                setSearchQuery={setRouteSearchQuery}
                onSelect={handleRouteSelect}
                onClose={closeRouteModal}
            />

            <EditTravelStopModal
                stops={stops}
                isModalVisible={showStopModal}
                searchQuery={stopSearchQuery}
                setSearchQuery={setStopSearchQuery}
                onSelect={handleStopSelect}
                onClose={closeStopModal}
            />
        </View>
    )
}