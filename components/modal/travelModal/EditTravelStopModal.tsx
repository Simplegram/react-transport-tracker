import { colors } from "@/const/color"
import { useTheme } from "@/context/ThemeContext"
import { inputStyles } from "@/src/styles/InputStyles"
import { modalElementStyles, modalStyles } from "@/src/styles/ModalStyles"
import { styles } from "@/src/styles/Styles"
import { EditableTravelStopModalProp } from "@/src/types/EditableTravels"
import { useMemo } from "react"
import { Modal, Pressable, Text, TextInput, View } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome6"
import FlatlistPicker from "../FlatlistPicker"

export default function EditTravelStopModal({ stops, searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableTravelStopModalProp) {
    const { theme } = useTheme()

    const filteredStops = useMemo(() => {
        if (!stops) return []
        const query = searchQuery.toLowerCase()
        return stops.filter(stop =>
            stop.name.toLowerCase().includes(query)
        )
    }, [stops, searchQuery])

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
                <TextInput
                    style={inputStyles[theme].textInput}
                    placeholder="Search stop..."
                    placeholderTextColor={colors.text.placeholderGray}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
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