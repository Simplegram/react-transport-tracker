import { Modal, Pressable, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native"
import Button from "@/components/BaseButton"
import { Stop } from "@/src/types/Travels";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useMemo } from "react";
import useGetTravelData from "@/hooks/useGetTravelData";
import { EditableTravelModalProp } from "@/src/types/EditableTravels";

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
                <Pressable style={styles.modalBackdrop} onPress={onClose}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select a Stop</Text>
                        </View>
                        <TextInput
                            style={styles.modalSearchInput}
                            placeholder="Search stop..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {filteredStops.length === 0 ? (
                            <View style={styles.emptyList}>
                                <Text>No stop found.</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={filteredStops}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.stopListItem}
                                        onPress={() => onSelect(item.id)}>
                                        {
                                            item.vehicle_type?.name 
                                            ? 
                                            <Icon name={item.vehicle_type.icon_id.name.toLocaleLowerCase()} size={16} style={{width: 20}}></Icon> 
                                            : 
                                            <Icon name="train" size={16}></Icon>
                                        }
                                        <Text style={styles.label}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                keyboardShouldPersistTaps={'always'}
                            />
                        )}

                        <Button title="Close" onPress={onClose} />
                    </View>
                </Pressable>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    inputGroup: {
        marginBottom: 15,
    },
    pressableInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        minHeight: 44,
        backgroundColor: '#fff',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        height: 400,
        marginTop: 'auto',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalCloseButton: {
        padding: 10,
    },
    modalCloseButtonText: {
        fontSize: 18,
        color: '#666',
    },
    modalSearchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    stopListItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    emptyList: {
        padding: 20,
        alignItems: 'center',
    }
})