import { Stop, VehicleType } from "@/src/types/Travels"
import moment from "moment"
import { useState } from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

interface AnnotationContentProps {
    fullVehicleTypes: VehicleType[]
    data_id: string
    title: string
    stop: Stop | null,
    time: string | null
}

export default function AnnotationContent({ fullVehicleTypes, data_id, title, stop, time }: AnnotationContentProps) {
    const [enableTitle, setEnableTitle] = useState<boolean>(false)

    const formattedTime = time ? moment(time.replace("T", " "), "yyyy-mm-dd HH:mm:ss").format("HH:mm:ss") : "no time"

    return (
        <TouchableOpacity style={styles.touchableContainer} disabled={true}>
            {enableTitle && (
                <TouchableOpacity onPress={() => setEnableTitle(!enableTitle)}>
                    <Text style={styles.title}>
                        {formattedTime}
                    </Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={[
                    styles.marker,
                    { backgroundColor: data_id === "stop" ? 'limegreen' : 'yellow' }
                ]}
                onPress={() => setEnableTitle(!enableTitle)}
            >
                {stop && (
                    <Icon size={10} name={fullVehicleTypes.find(type => type.id === Number(stop.vehicle_type))?.icon_id.name || 'truck-plane'} />
                )}
            </TouchableOpacity>
            {enableTitle && (
                <TouchableOpacity onPress={() => setEnableTitle(!enableTitle)}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    touchableContainer: {
        width: 70,
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
        fontWeight: 'bold',
        flexWrap: 'wrap'
    },
})