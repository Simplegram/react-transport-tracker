import { colors } from "@/const/color";
import { useTheme } from "@/context/ThemeContext";
import { inputStyles } from "@/src/styles/InputStyles";
import { modalElementStyles, modalStyles } from "@/src/styles/ModalStyles";
import { styles } from "@/src/styles/Styles";
import { EditableTravelRouteModalProp } from "@/src/types/EditableTravels";
import { useMemo } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6';
import FlatlistPicker from "../FlatlistPicker";

export default function EditTravelRouteModal({ routes, searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableTravelRouteModalProp) {
    const { theme } = useTheme()

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
            <Pressable style={modalStyles[theme].modalBackdrop} onPress={onClose}>
                <View style={modalStyles[theme].modalContainer}>
                    <View style={modalElementStyles[theme].header}>
                        <Text style={modalElementStyles[theme].title}>Select a Route</Text>
                        <Text style={modalElementStyles[theme].closeLabel}>Close</Text>
                    </View>
                    <TextInput
                        style={inputStyles[theme].textInput}
                        placeholder="Search stop..."
                        placeholderTextColor={colors.text.placeholderGray}
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
                                <>
                                    {item.vehicle_type_id?.name ? (
                                        <Icon
                                            style={[styles[theme].icon, { width: 20 }]}
                                            name={item.vehicle_type_id.icon_id.name.toLocaleLowerCase()}
                                            size={16}
                                        />
                                    ) : (
                                        <Icon style={styles[theme].icon} name="train" size={16} />
                                    )}
                                    <Text style={modalElementStyles[theme].label}>{`${item.code} | ${item.name}`}</Text>
                                </>
                            )}
                        </FlatlistPicker>
                    )}
                </View>
            </Pressable>
        </Modal>
    )
}