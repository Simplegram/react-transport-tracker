import Button from "@/components/BaseButton";
import useGetTravelData from "@/hooks/useGetTravelData";
import { EditableTravelModalProp } from "@/src/types/EditableTravels";
import { useMemo } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function EditTravelRouteModal({ searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableTravelModalProp) {
    const { routes } = useGetTravelData()

    const filteredItems = useMemo(() => {
        if (!routes) return [];
        const query = searchQuery.toLowerCase();
        return routes.filter(route =>
            route.name.toLowerCase().includes(query) || route.code.toLowerCase().includes(query)
        );
    }, [routes, searchQuery]);

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
                        placeholder="Search stop..."
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
                                    onPress={() => onSelect(item.id)}>
                                    {
                                        item.vehicle_type_id?.name ? <Icon name={item.vehicle_type_id.icon_id.name.toLocaleLowerCase()} size={16}></Icon> : <Icon name="train" size={16}></Icon>
                                    }
                                    <Text style={styles.label}>{`${item.code} | ${item.name}`}</Text>
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