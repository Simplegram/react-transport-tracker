import { TextInputBase } from "@/components/input/TextInput"
import ModalTemplate from "@/components/ModalTemplate"
import { useTheme } from "@/context/ThemeContext"
import { modalElementStyles, modalStyles } from "@/src/styles/ModalStyles"
import { styles } from "@/src/styles/Styles"
import { EditableTravelRouteModalProp } from "@/src/types/EditableTravels"
import { useMemo } from "react"
import { Pressable, Text, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'
import FlatlistBase from "../FlatlistPicker"

export default function EditTravelRouteModal({ routes, searchQuery, isModalVisible, setSearchQuery, onClose, onSelect }: EditableTravelRouteModalProp) {
    const { theme } = useTheme()

    const filteredItems = useMemo(() => {
        if (!routes) return []
        const query = searchQuery.toLowerCase()
        return routes.filter(route =>
            route.name.toLowerCase().includes(query) || route.code.toLowerCase().includes(query)
        )
    }, [routes, searchQuery])

    return (
        <ModalTemplate.Bottom
            visible={isModalVisible}
            onRequestClose={onClose}
        >
            <ModalTemplate.Container>
                <View style={modalElementStyles[theme].header}>
                    <Text style={modalElementStyles[theme].title}>Select a Route</Text>
                    <Pressable onPress={onClose}>
                        <Text style={modalElementStyles[theme].closeLabel}>Close</Text>
                    </Pressable>
                </View>
                <TextInputBase
                    value={searchQuery}
                    placeholder="Search route..."
                    onChangeText={setSearchQuery}
                />
                {filteredItems.length === 0 ? (
                    <View style={modalStyles[theme].emptyList}>
                        <Text style={modalElementStyles[theme].label}>No route found</Text>
                    </View>
                ) : (
                    <FlatlistBase.Picker
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
                    </FlatlistBase.Picker>
                )}
            </ModalTemplate.Container>
        </ModalTemplate.Bottom>
    )
}