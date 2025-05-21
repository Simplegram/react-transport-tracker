import useGetTravelData from "@/hooks/useGetTravelData";
import { EditableTravelDirectionModalProp, EditableTravelModalProp } from "@/src/types/EditableTravels";
import { useMemo } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { flatlistStyles, modalElementStyles, modalStyles } from "@/src/styles/ModalStyles";
import { useTheme } from "@/context/ThemeContext";
import { inputStyles } from "@/src/styles/InputStyles";
import { colors } from "@/const/color";

export default function EditTravelDirectionModal({ directions, searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableTravelDirectionModalProp) {
    const { theme } = useTheme()
    
    const filteredItems = useMemo(() => {
        if (!directions) return [];
        const query = searchQuery.toLowerCase();
        return directions.filter(direction =>
            direction.name.toLowerCase().includes(query)
        );
    }, [directions, searchQuery]);

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={modalStyles[theme].modalBackdrop} onPress={onClose}>
                <View style={modalStyles[theme].modalContainer}>
                    <View style={modalElementStyles[theme].header}>
                        <Text style={modalElementStyles[theme].title}>Select a Direction</Text>
                        <Text style={modalElementStyles[theme].closeLabel}>Close</Text>
                    </View>
                    <TextInput
                        style={inputStyles[theme].textInput}
                        placeholder="Search direction..."
                        placeholderTextColor={colors.text.placeholderGray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {filteredItems.length === 0 ? (
                        <View style={modalStyles[theme].emptyList}>
                            <Text style={modalElementStyles[theme].label}>No route found</Text>
                        </View>
                    ) : (
                        <FlatList
                            inverted={true}
                            data={filteredItems}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={flatlistStyles[theme].item}
                                    onPress={() => onSelect(item.id)}
                                >
                                    <Text style={modalElementStyles[theme].label}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyboardShouldPersistTaps={'always'}
                        />
                    )}
                </View>
            </Pressable>
        </Modal>
    )
}