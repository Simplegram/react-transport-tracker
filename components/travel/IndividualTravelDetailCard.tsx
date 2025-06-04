import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { DataItem } from "@/src/types/Travels"
import { getDiffString } from "@/src/utils/dateUtils"
import { formatLapTimeDisplay } from "@/src/utils/utils"
import moment from "moment"
import { Text, View } from "react-native"
import Divider from "../Divider"

interface TravelDetailCardProp {
    travel: DataItem
    travelTime: number
}

export default function IndividualTravelDetailCard({ travel, travelTime }: TravelDetailCardProp) {
    const { theme } = useTheme()

    try {
        const departureDate = moment(travel.bus_initial_departure)
        const finalArrivalDate = moment(travel.bus_final_arrival)
        const travelDuration = moment.duration(finalArrivalDate.diff(departureDate, 'seconds', true), "seconds")
        const durationString = getDiffString(travelDuration)

        const departureTime = formatLapTimeDisplay(travel.bus_initial_departure, true)
        const arrivalTime = formatLapTimeDisplay(travel.bus_final_arrival, true)
        const timeString = `${departureTime} - ${arrivalTime}`

        const stopString = `${travel.first_stop_id.name} to ${travel.last_stop_id.name}`
        const tripIdentifier = `${travel.routes.code} | ${travel.vehicle_code || 'N/A'}`

        const estimateDuration = moment.duration(travelTime, "seconds")
        const estimateDurationString = getDiffString(estimateDuration)
        const realEstimateDiff = estimateDuration.subtract(travelDuration)

        const diffColor = realEstimateDiff.seconds() > 0 ? colors.greenPositive_100 : colors.redCancel_100

        const diffString = getDiffString(realEstimateDiff, true)

        return (
            <View key={travel.id} style={travelDetailStyles[theme].detailRow}>
                <Text style={travelDetailStyles[theme].specialValue}>{tripIdentifier}</Text>
                <Text style={travelDetailStyles[theme].valueText}>{stopString}</Text>
                <Text style={travelDetailStyles[theme].valueText}>{timeString}</Text>
                <Divider />
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={travelDetailStyles[theme].valueText}>Estimate</Text>
                    <Text style={[travelDetailStyles[theme].valueText, { alignSelf: 'flex-end' }]}>{estimateDurationString}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={travelDetailStyles[theme].valueText}>Real</Text>
                    <Text style={travelDetailStyles[theme].valueText}>{durationString}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={travelDetailStyles[theme].valueText}>Diff</Text>
                    <Text style={[travelDetailStyles[theme].valueText, { color: diffColor }]}>{diffString}</Text>
                </View>
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

interface LabelValueProps {
    label: string
    value: string
}

export function JustifiedLabelValue({ label, value }: LabelValueProps) {
    const { theme } = useTheme()

    return (
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={travelDetailStyles[theme].valueText}>{label}</Text>
            <Text style={travelDetailStyles[theme].valueText}>{value}</Text>
        </View>
    )
}