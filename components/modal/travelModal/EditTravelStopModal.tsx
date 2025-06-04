import Button from "@/components/BaseButton"
import { TextInputBase } from "@/components/input/TextInput"
import { useModalContext } from "@/context/ModalContext"
import { useTheme } from "@/context/ThemeContext"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { modalElementStyles, modalStyles } from "@/src/styles/ModalStyles"
import { styles } from "@/src/styles/Styles"
import { EditableTravelStopModalProp } from "@/src/types/EditableTravels"
import { useMemo, useState } from "react"
import { Modal, Pressable, Text, View } from "react-native"
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
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={modalStyles[theme].modalBackdrop} onPress={onClose} />
            <View style={modalStyles[theme].modalContainer}>
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
                    <Button
                        style={enableFilter ? buttonStyles[theme].addButton : buttonStyles[theme].inactiveButton}
                        textStyle={enableFilter ? buttonStyles[theme].addButtonText : buttonStyles[theme].inactiveButtonText}
                        onPress={() => setEnableFilter(!enableFilter)}
                    >Filter</Button>
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
            </View>
        </Modal>
    )
}