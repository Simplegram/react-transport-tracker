import useGetTravelData from "@/hooks/useGetTravelData";
import { Stop, VehicleType } from "@/src/types/Travels";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'

interface AnnotationContentProps {
    fullVehicleTypes: VehicleType[]
    data_id: string
    title: string
    stop: Stop | null
}

export default function AnnotationContent({ fullVehicleTypes, data_id, title, stop }: AnnotationContentProps) {
    const [enableTitle, setEnableTitle] = useState<boolean>(false)

    return (
        <TouchableOpacity style={styles.touchableContainer} onPress={() => setEnableTitle(!enableTitle)}>
            <View style={[styles.marker, { backgroundColor: data_id === "stop" ? 'limegreen' : 'yellow' }]}>
                {stop && (
                    <Icon size={10} name={fullVehicleTypes.find(type => type.id === stop.vehicle_type)?.icon_id.name} />
                )}
            </View>
            {enableTitle && (
                <Text style={styles.title}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchableContainer: {
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    marker: {
        width: 19,
        aspectRatio: 1,
        borderWidth: 2,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
});