import { useTheme } from "@/context/ThemeContext"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { DataItem } from "@/src/types/Travels"
import { formatMsToHoursMinutes, timeToMinutes } from "@/src/utils/dateUtils"
import { formatLapTimeDisplay } from "@/src/utils/utils"
import { Text, View } from "react-native"

interface TravelDetailCardProp {
    travel: DataItem
    travelTimes: number[]
    index: number
}

export default function IndividualTravelDetailCard({ travel, travelTimes, index }: TravelDetailCardProp) {
    const { theme } = useTheme()

    try {
        const departureDate = new Date(travel.bus_initial_departure)
        const finalArrivalDate = new Date(travel.bus_final_arrival)
        const durationMillis = finalArrivalDate.getTime() - departureDate.getTime()
        const durationString = formatMsToHoursMinutes(durationMillis)

        const departureTime = formatLapTimeDisplay(travel.bus_initial_departure, true)
        const arrivalTime = formatLapTimeDisplay(travel.bus_final_arrival, true)
        const timeString = `${departureTime} - ${arrivalTime}`

        const stopString = `${travel.first_stop_id.name} to ${travel.last_stop_id.name}`
        const tripIdentifier = `${travel.routes.code} | ${travel.vehicle_code || 'N/A'}`

        return (
            <View key={travel.id} style={travelDetailStyles[theme].detailRow}>
                <Text style={travelDetailStyles[theme].specialValue}>{tripIdentifier}</Text>
                <Text style={travelDetailStyles[theme].valueText}>{stopString}</Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                }}>
                    <Text style={travelDetailStyles[theme].valueText}>{timeString}</Text>
                    <Text style={travelDetailStyles[theme].valueText}>({durationString})</Text>
                </View>
                <Text style={travelDetailStyles[theme].valueText}>{`Route Average: ${timeToMinutes(travelTimes[index])}`}</Text>
            </View>
        )
    } catch (error) {
        console.error(`Error calculating duration for trip ID ${travel.id || 'unknown'}:`, error)
        return (
            <View key={travel.id} style={travelDetailStyles[theme].detailRow}>
                <Text style={travelDetailStyles[theme].label}>Trip ID {travel.id || 'N/A'} Duration:</Text>
                <Text style={travelDetailStyles[theme].valueText}>Calculation Error</Text>
            </View>
        )
    }
}