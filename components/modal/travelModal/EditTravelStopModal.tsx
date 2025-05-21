import { Modal, Pressable, View, Text, TextInput, FlatList, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome6";
import { useMemo } from "react";
import { EditableTravelStopModalProp } from "@/src/types/EditableTravels";
import { flatlistStyles, modalElementStyles, modalStyles } from "@/src/styles/ModalStyles";
import { useTheme } from "@/context/ThemeContext";
import { inputStyles } from "@/src/styles/InputStyles";
import { colors } from "@/const/color";
import { styles } from "@/src/styles/Styles";

export default function EditTravelStopModal({ stops, searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableTravelStopModalProp) {
    const { theme } = useTheme()
    
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
                <Pressable style={modalStyles[theme].modalBackdrop} onPress={onClose}>
                    <View style={modalStyles[theme].modalContainer}>
                        <View style={modalElementStyles[theme].header}>
                            <Text style={modalElementStyles[theme].title}>Select a Stop</Text>
                            <Text style={modalElementStyles[theme].closeLabel}>Close</Text>
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
                            <FlatList
                                inverted={true}
                                data={filteredStops}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={flatlistStyles[theme].item}
                                        onPress={() => onSelect(item.id)}>
                                        {
                                            item.vehicle_type?.name
                                                ?
                                                <Icon style={[styles[theme].icon, { width: 20 }]} name={item.vehicle_type.icon_id.name.toLocaleLowerCase()} size={16}></Icon>
                                                :
                                                <Icon style={styles[theme].icon} name="train" size={16}></Icon>
                                        }
                                        <Text style={modalElementStyles[theme].label}>{item.name}</Text>
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