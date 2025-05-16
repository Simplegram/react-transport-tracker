import useGetTravelData from "@/hooks/useGetTravelData";
import { EditableTravelModalProp } from "@/src/types/EditableTravels";
import { useMemo } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { flatlistStyles, modalStyles } from "@/src/styles/ModalStyles";

export default function EditTravelDirectionModal({ searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableTravelModalProp) {
    const { directions } = useGetTravelData()

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
            <Pressable style={modalStyles.modalBackdrop} onPress={onClose}>
                <View style={modalStyles.modalContainer}>
                    <View style={modalStyles.modalHeader}>
                        <Text style={modalStyles.modalTitle}>Select a Direction</Text>
                        <Text style={modalStyles.closeLabel}>Close</Text>
                    </View>
                    <TextInput
                        style={modalStyles.modalSearchInput}
                        placeholder="Search direction..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {filteredItems.length === 0 ? (
                        <View style={modalStyles.emptyList}>
                            <Text>No route found.</Text>
                        </View>
                    ) : (
                        <FlatList
                            inverted={true}
                            data={filteredItems}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={flatlistStyles.item}
                                    onPress={() => onSelect(item.id)}
                                >
                                    <Text style={modalStyles.label}>{item.name}</Text>
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