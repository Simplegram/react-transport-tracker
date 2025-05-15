import Button from "@/components/BaseButton";
import useGetTravelData from "@/hooks/useGetTravelData";
import { EditableTravelModalProp } from "@/src/types/EditableTravels";
import { useMemo } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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
            <Pressable style={styles.modalBackdrop} onPress={onClose}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select a Route</Text>
                    </View>
                    <TextInput
                        style={styles.modalSearchInput}
                        placeholder="Search direction..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {filteredItems.length === 0 ? (
                        <View style={styles.emptyList}>
                            <Text>No route found.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredItems}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.listItem}
                                    onPress={() => onSelect(item.id)}
                                >
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
    )
}

const styles = StyleSheet.create({
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
    modalSearchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    emptyList: {
        padding: 20,
        alignItems: 'center',
    },
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
})