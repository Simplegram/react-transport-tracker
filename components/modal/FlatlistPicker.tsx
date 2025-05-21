import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { flatlistStyles, modalElementStyles } from "@/src/styles/ModalStyles";
import { FlatList, Text, TouchableOpacity } from "react-native";

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