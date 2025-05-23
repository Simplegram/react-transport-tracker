import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import PagerView from 'react-native-pager-view'

import { colors } from '@/const/color'
import { useTravelContext } from '@/context/PageContext'
import { useTheme } from '@/context/ThemeContext'
import { travelCardStyles, travelEmptyContainer } from '@/src/styles/TravelListStyles'
import { DataItem, Lap } from '@/src/types/Travels'
import { formatDate } from '@/src/utils/dateUtils'
import { calculateDuration } from '@/src/utils/utils'
import { router } from 'expo-router'
import moment from 'moment'
import Divider from './Divider'
import { DataItemWithNewKey } from '@/src/utils/dataUtils'

interface GroupedDataDisplayProps {
    data: Record<string, DataItemWithNewKey[]>
    currentDate: string
}

export default function GroupedDataDisplay({ data: finalGroupedData, currentDate }: GroupedDataDisplayProps) {
    const { theme } = useTheme()

    const { setSelectedItem, setSelectedTravelItems } = useTravelContext()

    const formattedCurrentDate = moment(currentDate).format('LL')

    const directionNames = Object.keys(finalGroupedData).sort()

    const handleItemPress = (directionNameKey: string, itemIndex: number) => {
        const itemToSelect = finalGroupedData[directionNameKey][itemIndex]
        if (itemToSelect) {
            setSelectedItem(itemToSelect)
            router.push("/(tabs)/editTravel")
        }
    }

    const handleViewTravelDetails = (directionNameKey: string) => {
        setSelectedTravelItems(finalGroupedData[directionNameKey])
        router.push("/(tabs)/travelDetail")
    }

    const borderColor = theme === 'light' ? colors.background.black : colors.text.dimmerWhite
    const dateLabelColor = theme === 'light' ? '#2c3e50' : colors.text.dimWhite

    return (
        <View style={styles.mainContainer}>
            <Text style={[styles.groupTitle, { color: dateLabelColor }]}>
                {formattedCurrentDate}
            </Text>
            {directionNames.length > 0 ? (
                <PagerView
                    style={styles.pagerView}
                    initialPage={0}
                    key={directionNames.length}
                    pageMargin={10}
                >
                    {directionNames.map((directionNameKey, index) => (
                        <View key={directionNameKey} style={{
                            flex: 1,
                            paddingTop: 6,
                            paddingLeft: 10,
                            paddingBottom: 10,
                            paddingRight: 10,
                            borderWidth: 1,
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                            borderColor: borderColor
                        }}>
                            <View key={directionNameKey} style={styles.cardCanvas}>
                                <View>
                                    <Pressable onPress={() => handleViewTravelDetails(directionNameKey)}>
                                        <Text style={[styles.groupTitle, { color: dateLabelColor }]}>
                                            Direction ({index + 1}/{directionNames.length}): {directionNameKey}
                                        </Text>
                                    </Pressable>
                                </View>

                                <ScrollView contentContainerStyle={travelCardStyles[theme].cardHolder} nestedScrollEnabled={true}>
                                    {finalGroupedData[directionNameKey].map((item, itemIndex) => (
                                        <Pressable
                                            key={item.id}
                                            style={travelCardStyles[theme].card}
                                            onPress={() => handleItemPress(directionNameKey, itemIndex)}
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
                                    ))}
                                </ScrollView>
                            </View>
                            {directionNames.length > 1 && (
                                <>
                                    <Divider />
                                    <View style={styles.swipeZone}>
                                        <Text style={[styles.swipeZoneText, { color: dateLabelColor }]}>{`<<< Safe Swipe Zone >>>`}</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    ))}
                </PagerView>
            ) : (
                <View style={[
                    travelEmptyContainer[theme].noDataContainer,
                    { borderColor: borderColor }
                ]}>
                    <Text style={travelEmptyContainer[theme].noDataText}>No data available to display</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    pagerView: {
        flex: 1,
    },
    cardCanvas: {
        flex: 7,
    },
    swipeZone: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    swipeZoneText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    groupTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 8,
        textAlign: 'center',
    },
})