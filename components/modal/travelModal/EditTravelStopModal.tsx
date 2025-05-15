import { Modal, Pressable, View, Text, TextInput, FlatList, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome6";
import { useMemo } from "react";
import useGetTravelData from "@/hooks/useGetTravelData";
import { EditableTravelModalProp } from "@/src/types/EditableTravels";
import modalStyles from "@/src/styles/ModalStyles";

export default function EditTravelStopModal({ searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableTravelModalProp) {
    const { stops } = useGetTravelData();

    const filteredStops = useMemo(() => {
        if (!stops) return [];
        const query = searchQuery.toLowerCase();
        return stops.filter(stop =>
            stop.name.toLowerCase().includes(query)
        );
    }, [stops, searchQuery]);

    return (
        <>
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={onClose}
            >
                <Pressable style={modalStyles.modalBackdrop} onPress={onClose}>
                    <View style={modalStyles.modalContainer}>
                        <View style={modalStyles.modalHeader}>
                            <Text style={modalStyles.modalTitle}>Select a Stop</Text>
                            <Text style={modalStyles.closeLabel}>Close</Text>
                        </View>
                        <TextInput
                            style={modalStyles.modalSearchInput}
                            placeholder="Search stop..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {filteredStops.length === 0 ? (
                            <View style={modalStyles.emptyList}>
                                <Text>No stop found.</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={filteredStops}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={modalStyles.listItem}
                                        onPress={() => onSelect(item.id)}>
                                        {
                                            item.vehicle_type?.name
                                                ?
                                                <Icon name={item.vehicle_type.icon_id.name.toLocaleLowerCase()} size={16} style={{ width: 20 }}></Icon>
                                                :
                                                <Icon name="train" size={16}></Icon>
                                        }
                                        <Text style={modalStyles.label}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                keyboardShouldPersistTaps={'always'}
                            />
                        )}
                    </View>
                </Pressable>
            </Modal>
        </>
    )
}