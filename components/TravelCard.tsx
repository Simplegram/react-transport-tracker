import { useTheme } from "@/context/ThemeContext"
import { travelCardStyles } from "@/src/styles/TravelListStyles"
import { DataItemWithNewKey } from "@/src/utils/dataUtils"
import { formatDate } from "@/src/utils/dateUtils"
import { calculateDuration } from "@/src/utils/utils"
import { Pressable, Text, View } from "react-native"
import Divider from "./Divider"

interface TravelCardProps {
    item: DataItemWithNewKey
    index: number
    directionNameKey: string
    onPress: (directionNameKey: string, itemIndex: number) => void
}

export default function TravelCard({ item, index, directionNameKey, onPress }: TravelCardProps) {
    const { theme } = useTheme()

    return (
        <Pressable
            key={item.id}
            style={travelCardStyles[theme].card}
            onPress={() => onPress(directionNameKey, index)}
        >
            <View style={travelCardStyles[theme].routeInfoSection}>
                <Text style={travelCardStyles[theme].routeText}>
                    {item.routes?.code} | {item.routes?.name || item.routes?.code || 'N/A'}
                </Text>
                <Text style={travelCardStyles[theme].vehicleText}>
                    {item.vehicle_code || 'N/A'}
                </Text>
            </View>

            <Divider />

            <View style={travelCardStyles[theme].stopsTimeSection}>
                <View style={travelCardStyles[theme].stopTimeBlock}>
                    <Text style={travelCardStyles[theme].stopText}>{item.first_stop_id?.name || 'N/A'}</Text>
                    <Text style={travelCardStyles[theme].timeText}>
                        {item.bus_initial_departure ? formatDate(item.bus_initial_departure) : 'N/A'}
                    </Text>
                </View>

                <View style={travelCardStyles[theme].stopArrowBlock}>
                    <Text style={travelCardStyles[theme].stopArrowText}>➜</Text>
                    <Text style={travelCardStyles[theme].notesLabel}>{calculateDuration(item)}</Text>
                </View>

                <View style={travelCardStyles[theme].stopTimeBlock}>
                    <Text style={travelCardStyles[theme].stopText}>{item.last_stop_id?.name || 'N/A'}</Text>
                    <Text style={travelCardStyles[theme].timeText}>
                        {item.bus_final_arrival ? formatDate(item.bus_final_arrival) : 'N/A'}
                    </Text>
                </View>
            </View>

            <Divider />

            <View style={travelCardStyles[theme].lapsSection}>
                <Text style={travelCardStyles[theme].lapText}>{item.lapCount} lap(s)</Text>
            </View>

            {item.notes && (
                <>
                    <Divider />
                    <View style={travelCardStyles[theme].notesSection}>
                        <Text style={travelCardStyles[theme].notesLabel}>Notes:</Text>
                        <Text style={travelCardStyles[theme].notesText}>
                            {item.notes}
                        </Text>
                    </View>
                </>
            )}
        </Pressable>
    )
}