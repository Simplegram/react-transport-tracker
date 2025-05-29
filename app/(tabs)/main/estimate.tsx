import Button from "@/components/BaseButton"
import EditTravelDirectionModal from "@/components/modal/travelModal/EditTravelDirectionModal"
import EditTravelRouteModal from "@/components/modal/travelModal/EditTravelRouteModal"
import EditTravelStopModal from "@/components/modal/travelModal/EditTravelStopModal"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import useModalHandler from "@/hooks/useModalHandler"
import useTravelDetail from "@/hooks/useTravelDetail"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { mainMenuStyles } from "@/src/styles/MainMenuStyles"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"

interface TravelTimeInput {
    route_id: number | undefined
    direction_id: number | undefined
    first_stop_id: number | undefined
    last_stop_id: number | undefined
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

    const [input, setInput] = useState<TravelTimeInput>({ route_id: undefined, direction_id: undefined, first_stop_id: undefined, last_stop_id: undefined })

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
        console.log(input)
    }

    return (
        <View style={mainMenuStyles[theme].container}>
            <View style={{
                flex: 1,
            }}>
                
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