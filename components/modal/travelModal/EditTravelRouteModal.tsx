import CustomIcon from "@/components/CustomIcon"
import Input from "@/components/input/Input"
import { TextInputBase } from "@/components/input/TextInput"
import ModalTemplate from "@/components/ModalTemplate"
import { useTheme } from "@/context/ThemeContext"
import { modalElementStyles, modalStyles } from "@/src/styles/ModalStyles"
import { EditableTravelRouteModalProp } from "@/src/types/EditableTravels"
import { useMemo } from "react"
import { Pressable, View } from "react-native"
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
            <ModalTemplate.BottomContainer>
                <View style={modalElementStyles[theme].header}>
                    <Input.Header>Select a route</Input.Header>
                    <Pressable onPress={onClose}>
                        <Input.Subtitle>Close</Input.Subtitle>
                    </Pressable>
                </View>
                <TextInputBase
                    value={searchQuery}
                    placeholder="Search route..."
                    onChangeText={setSearchQuery}
                />
                {filteredItems.length === 0 ? (
                    <View style={modalStyles[theme].emptyList}>
                        <Input.Label>No route found</Input.Label>
                    </View>
                ) : (
                    <FlatlistBase.Picker
                        items={filteredItems}
                        onSelect={onSelect}
                    >
                        {(item) => (
                            <>
                                {item.vehicle_type_id?.name ? (
                                    <CustomIcon style={{ width: 20 }} name={item.vehicle_type_id.icon_id.name.toLocaleLowerCase()} size={16} />
                                ) : (
                                    <CustomIcon name="train" size={16} />
                                )}
                                <Input.Label>{`${item.code} | ${item.name}`}</Input.Label>
                            </>
                        )}
                    </FlatlistBase.Picker>
                )}
            </ModalTemplate.BottomContainer>
        </ModalTemplate.Bottom>
    )
}