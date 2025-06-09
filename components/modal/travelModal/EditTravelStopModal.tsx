import Button from "@/components/button/BaseButton"
import { TextInputBase } from "@/components/input/TextInput"
import ModalTemplate from "@/components/ModalTemplate"
import { useModalContext } from "@/context/ModalContext"
import { useTheme } from "@/context/ThemeContext"
import { modalElementStyles, modalStyles } from "@/src/styles/ModalStyles"
import { styles } from "@/src/styles/Styles"
import { EditableTravelStopModalProp } from "@/src/types/EditableTravels"
import { useMemo, useState } from "react"
import { Pressable, Text, View } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome6"
import FlatlistPicker from "../FlatlistPicker"

export default function EditTravelStopModal({ stops, searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableTravelStopModalProp) {
    const { theme } = useTheme()
    const { vehicleTypeId } = useModalContext()

    const [enableFilter, setEnableFilter] = useState<boolean>(vehicleTypeId ? true : false)

    const filteredStops = useMemo(() => {
        if (!stops) return []
        const query = searchQuery.toLowerCase()
        const stopsByQuery = stops.filter(stop =>
            stop.name.toLowerCase().includes(query)
        )
        const stopsByVehicleId = stopsByQuery.filter(stop => stop.vehicle_type?.id === vehicleTypeId)
        return (enableFilter && vehicleTypeId) ? stopsByVehicleId : stopsByQuery
    }, [stops, searchQuery, enableFilter, vehicleTypeId])

    return (
        <ModalTemplate.Bottom
            visible={isModalVisible}
            onRequestClose={onClose}
        >
            <ModalTemplate.Container>
                <View style={modalElementStyles[theme].header}>
                    <Text style={modalElementStyles[theme].title}>Select a Stop</Text>
                    <Pressable onPress={onClose}>
                        <Text style={modalElementStyles[theme].closeLabel}>Close</Text>
                    </Pressable>
                </View>
                <View style={{
                    gap: 5,
                    flexDirection: 'row'
                }}>
                    <TextInputBase
                        value={searchQuery}
                        placeholder="Search stop..."
                        onChangeText={setSearchQuery}
                        style={{ flex: 5 }}
                    />
                    <Button.Switch switch={enableFilter} onPress={() => setEnableFilter(!enableFilter)}>Filter</Button.Switch>
                </View>
                {filteredStops.length === 0 ? (
                    <View style={modalStyles[theme].emptyList}>
                        <Text style={modalElementStyles[theme].label}>No stop found</Text>
                    </View>
                ) : (
                    <FlatlistPicker
                        items={filteredStops}
                        onSelect={onSelect}
                    >
                        {(item) => (
                            <>
                                {item.vehicle_type?.name ? (
                                    <Icon
                                        style={[styles[theme].icon, { width: 20 }]}
                                        name={item.vehicle_type.icon_id.name.toLocaleLowerCase()}
                                        size={16}
                                    />
                                ) : (
                                    <Icon style={styles[theme].icon} name="train" size={16}></Icon>
                                )}
                                <Text style={modalElementStyles[theme].label}>{item.name}</Text>
                            </>
                        )}
                    </FlatlistPicker>
                )}
            </ModalTemplate.Container>
        </ModalTemplate.Bottom>
    )
}