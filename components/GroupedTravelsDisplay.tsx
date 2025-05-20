import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';

import { DataItem, Lap } from '@/src/types/Travels'; // Import the interface from your specified path
import { useTravelContext } from '@/context/PageContext';
import { router, useFocusEffect } from 'expo-router';
import { calculateDuration } from '@/src/utils/utils';
import moment from 'moment';
import { formatDate } from '@/src/utils/dateUtils';
import useGetTravelData from '@/hooks/useGetTravelData';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/const/color';
import Divider from './Divider';
import { travelCardStyles, travelEmptyContainer } from '@/src/styles/TravelListStyles';

interface GroupedDataDisplayProps {
    data: DataItem[];
    currentDate: string
}

export default function GroupedDataDisplay({ data, currentDate }: GroupedDataDisplayProps) {
    const { theme } = useTheme()

    const { setSelectedItem, setSelectedTravelItems } = useTravelContext();

    const formattedCurrentDate = moment(currentDate).format('LL')

    const { laps, getAllLaps } = useGetTravelData()

    useEffect(() => {
        getAllLaps()
    }, [])

    // Grouping data remains the same
    const groupedData = data.reduce((acc, currentItem) => {
        const directionName = currentItem.directions?.name || 'Unassigned Direction';
        const directionKey = directionName;

        if (!acc[directionKey]) {
            acc[directionKey] = [];
        }
        acc[directionKey].push(currentItem);
        return acc;
    }, {} as Record<string, DataItem[]>);

    // Sorting items within each group remains the same (optional, but good practice)
    const sortedGroupedData: Record<string, DataItem[]> = {};
    Object.keys(groupedData).forEach(directionKey => {
        sortedGroupedData[directionKey] = groupedData[directionKey].sort((a, b) => {
            // Use valid date checks and handle potential null/invalid dates gracefully
            const timeA = (a.bus_initial_departure && new Date(a.bus_initial_departure).getTime()) || Infinity;
            const timeB = (b.bus_initial_departure && new Date(b.bus_initial_departure).getTime()) || Infinity;

            return timeA - timeB;
        });
    });

    interface DataItemWithNewKey extends DataItem {
        lapCount: number; // Define the new key and its type
    }

    const finalGroupedDataWithNewKey: Record<string, DataItemWithNewKey[]> = {};
    Object.keys(sortedGroupedData).forEach(directionKey => {
        finalGroupedDataWithNewKey[directionKey] = sortedGroupedData[directionKey].map(item => {
            const matchingLaps = laps.filter(lap => lap.travel_id === item.id);
            const lapCount = matchingLaps.length;

            return {
                ...item,
                lapCount: lapCount
            };
        });
    });

    // Use the sorted data for rendering
    const finalGroupedData = finalGroupedDataWithNewKey;


    // Get the keys (direction names) and sort them for consistent page order
    const directionNames = Object.keys(finalGroupedData).sort();

    const handleItemPress = (directionNameKey: string, itemIndex: number) => {
        // Access the item from the correctly grouped/sorted data
        const itemToSelect = finalGroupedData[directionNameKey][itemIndex];
        if (itemToSelect) {
            setSelectedItem(itemToSelect);
            router.push("/(tabs)/editTravel");
        }
    };

    const handleViewTravelDetails = (directionNameKey: string) => {
        setSelectedTravelItems(finalGroupedData[directionNameKey]);
        router.push("/(tabs)/travelDetail");
    };

    const backgroundColor = theme === 'light' ? colors.background.white : colors.background.black
    const borderColor = theme === 'light' ? colors.background.black : colors.background.white
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
                            padding: 10,
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
                                            Direction: {directionNameKey} ({index + 1}/{directionNames.length})
                                        </Text>
                                    </Pressable>
                                </View>

                                <ScrollView contentContainerStyle={travelCardStyles['light'].cardHolder} nestedScrollEnabled={true}>
                                    {finalGroupedData[directionNameKey].map((item, itemIndex) => (
                                        <Pressable 
                                            key={item.id} 
                                            style={[
                                                travelCardStyles['light'].card, 
                                                theme === 'dark' && travelCardStyles['dark'].card
                                            ]} 
                                            onPress={() => handleItemPress(directionNameKey, itemIndex)}
                                        >
                                            <View style={travelCardStyles['light'].routeInfoSection}>
                                                <Text style={[
                                                    travelCardStyles['light'].routeText,
                                                    theme === 'dark' && travelCardStyles['dark'].routeText
                                                ]}>
                                                    {item.routes?.code} | {item.routes?.name || item.routes?.code || 'N/A'}
                                                </Text>
                                                <Text style={[
                                                    travelCardStyles['light'].vehicleText,
                                                    theme === 'dark' && travelCardStyles['dark'].vehicleText
                                                ]}>
                                                    {item.vehicle_code || 'N/A'}
                                                </Text>
                                            </View>

                                            <View style={travelCardStyles['light'].stopsTimeSection}>
                                                <View style={travelCardStyles['light'].stopTimeBlock}>
                                                    <Text style={[
                                                        travelCardStyles['light'].stopText,
                                                        theme === 'dark' && travelCardStyles['dark'].routeText
                                                    ]}>{item.first_stop_id?.name || 'N/A'}</Text>
                                                    <Text style={[
                                                        travelCardStyles['light'].timeText,
                                                        theme === 'dark' && travelCardStyles['dark'].vehicleText
                                                    ]}>
                                                        {item.bus_initial_departure ? formatDate(item.bus_initial_departure) : 'N/A'}
                                                    </Text>
                                                </View>

                                                <View style={travelCardStyles['light'].stopArrowBlock}>
                                                    <Text style={[
                                                        travelCardStyles['light'].stopArrowText,
                                                        theme === 'dark' && travelCardStyles['dark'].stopArrowText
                                                    ]}>➜</Text>
                                                    <Text style={[
                                                        travelCardStyles['light'].notesLabel,
                                                        theme === 'dark' && travelCardStyles['dark'].whiteText
                                                    ]}>{calculateDuration(item)}</Text>
                                                </View>

                                                <View style={travelCardStyles['light'].stopTimeBlock}>
                                                    <Text style={[
                                                        travelCardStyles['light'].stopText,
                                                        theme === 'dark' && travelCardStyles['dark'].routeText
                                                    ]}>{item.last_stop_id?.name || 'N/A'}</Text>
                                                    <Text style={[
                                                        travelCardStyles['light'].timeText,
                                                        theme === 'dark' && travelCardStyles['dark'].vehicleText
                                                    ]}>
                                                        {item.bus_final_arrival ? formatDate(item.bus_final_arrival) : 'N/A'}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={travelCardStyles['light'].lapsSection}>
                                                <Text style={[
                                                    travelCardStyles['light'].lapText,
                                                    theme === 'dark' && travelCardStyles['dark'].whiteText
                                                ]}>{item.lapCount} lap(s)</Text>
                                            </View>

                                            {item.notes && (
                                                <View style={travelCardStyles['light'].notesSection}>
                                                    <Text style={[
                                                        travelCardStyles['light'].notesLabel,
                                                        theme === 'dark' && travelCardStyles['dark'].notesLabel
                                                    ]}>Notes:</Text>
                                                    <Text style={[
                                                        travelCardStyles['light'].notesText,
                                                        theme === 'dark' && travelCardStyles['dark'].whiteText
                                                    ]}>
                                                        {item.notes}
                                                    </Text>
                                                </View>
                                            )}
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </View>
                            <Divider />
                            <View style={styles.swipeZone}>
                                <Text style={[styles.swipeZoneText, { color: dateLabelColor }]}>{`<<< Safe Swipe Zone >>>`}</Text>
                            </View>
                        </View>
                    ))}
                </PagerView>
            ) : (
                <View style={[
                    travelEmptyContainer['light'].noDataContainer, 
                    { borderColor: borderColor }
                ]}>
                    <Text style={[
                        travelEmptyContainer['light'].noDataText,
                        theme === 'dark' && travelEmptyContainer['dark'].noDataText,
                    ]}>No data available to display</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    pagerView: {
        flex: 1,
    },
    cardCanvas: {
        flex: 7,
        paddingBottom: 10,
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
});