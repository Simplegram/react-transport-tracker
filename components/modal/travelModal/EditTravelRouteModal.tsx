import Button from "@/components/BaseButton";
import useGetTravelData from "@/hooks/useGetTravelData";
import { EditableTravelModalProp } from "@/src/types/EditableTravels";
import { useMemo } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'
import modalStyles from "@/src/styles/ModalStyles";

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
            <Pressable style={modalStyles.modalBackdrop} onPress={onClose}>
                <View style={modalStyles.modalContainer}>
                    <View style={modalStyles.modalHeader}>
                        <Text style={modalStyles.modalTitle}>Select a Route</Text>
                        <Text style={modalStyles.closeLabel}>Close</Text>
                    </View>
                    <TextInput
                        style={modalStyles.modalSearchInput}
                        placeholder="Search stop..."
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
                                    style={modalStyles.listItem}
                                    onPress={() => onSelect(item.id)}>
                                    {
                                        item.vehicle_type_id?.name ? <Icon name={item.vehicle_type_id.icon_id.name.toLocaleLowerCase()} size={16}></Icon> : <Icon name="train" size={16}></Icon>
                                    }
                                    <Text style={modalStyles.label}>{`${item.code} | ${item.name}`}</Text>
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