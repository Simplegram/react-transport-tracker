import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { inputStyles } from "@/src/styles/InputStyles"
import { modalElementStyles, modalStyles } from "@/src/styles/ModalStyles"
import { EditableTravelDirectionModalProp } from "@/src/types/EditableTravels"
import { useMemo } from "react"
import { Modal, Pressable, Text, TextInput, View } from "react-native"
import FlatlistPicker from "../FlatlistPicker"

export default function EditTravelDirectionModal({ directions, searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableTravelDirectionModalProp) {
    const { theme } = useTheme()

    const filteredItems = useMemo(() => {
        if (!directions) return []
        const query = searchQuery.toLowerCase()
        return directions.filter(direction =>
            direction.name.toLowerCase().includes(query)
        )
    }, [directions, searchQuery])

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
                    <Text style={modalElementStyles[theme].title}>Select a Direction</Text>
                    <Pressable onPress={onClose}>
                        <Text style={modalElementStyles[theme].closeLabel}>Close</Text>
                    </Pressable>
                </View>
                <TextInput
                    style={inputStyles[theme].textInput}
                    placeholder="Search direction..."
                    placeholderTextColor={colors.placeholderGray}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {filteredItems.length === 0 ? (
                    <View style={modalStyles[theme].emptyList}>
                        <Text style={modalElementStyles[theme].label}>No route found</Text>
                    </View>
                ) : (
                    <FlatlistPicker
                        items={filteredItems}
                        onSelect={onSelect}
                    >
                        {(item) => (
                            <Text style={modalElementStyles[theme].label}>{item.name}</Text>
                        )}
                    </FlatlistPicker>
                )}
            </View>
        </Modal>
    )
}