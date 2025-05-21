import { useTheme } from "@/context/ThemeContext";
import { flatlistStyles } from "@/src/styles/ModalStyles";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";

interface FlatlistPickerProps {
    items: any[];
    onSelect: (id: any) => void;
    children?: (item: any) => React.ReactNode;
}

export default function FlatlistPicker({ items, onSelect, children }: FlatlistPickerProps) {
    const { theme } = useTheme()

    return (
        <FlatList
            inverted={true}
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={flatlistStyles[theme].item}
                    onPress={() => onSelect(item.id)}
                >
                    {children && children(item)}
                </TouchableOpacity>
            )}
            keyboardShouldPersistTaps={'always'}
        />
    )
}