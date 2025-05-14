import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
// Import PagerView
import PagerView from 'react-native-pager-view';

import { DataItem } from '@/src/types/Travels'; // Import the interface from your specified path
import { TravelContext, useTravelContext } from '@/context/PageContext';
import { router, useNavigation } from 'expo-router';

// Get screen dimensions for setting PagerView page width
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { useTravelContext } from '@/context/PageContext';
import { router } from 'expo-router';
import { calculateDuration } from '@/src/utils/utils';

interface GroupedDataDisplayProps {
  data: DataItem[];
}

function formatDate(
  date: Date,
  custom_hours: number | null = null,
  custom_minutes: number | null = null,
  custom_seconds: number | null = null
) {
  // Ensure we're working with a Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    // Handle invalid date, perhaps return a placeholder or throw an error
    return "Invalid Date";
  }

  const hours = custom_hours !== null ? String(custom_hours).padStart(2, '0') : String(date.getHours()).padStart(2, '0');
  const minutes = custom_minutes !== null ? String(custom_minutes).padStart(2, '0') : String(date.getMinutes()).padStart(2, '0');
  const seconds = custom_seconds !== null ? String(custom_seconds).padStart(2, '0') : String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

const GroupedDataDisplay: React.FC<GroupedDataDisplayProps> = ({ data }) => {
  const { setSelectedItem, setSelectedTravelItems } = useTravelContext();

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
   // Use the sorted data for rendering
  const finalGroupedData = sortedGroupedData;


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

  return (
    // The main container now wraps the PagerView and takes up the screen height
    <View style={styles.mainContainer}>
      {directionNames.length > 0 ? (
        // Use PagerView for horizontal swiping
        <PagerView style={styles.pagerView} initialPage={0} key={directionNames.length}>
          {directionNames.map((directionNameKey, index) => (
            // Each child of PagerView is a separate page (a direction)
            <View key={directionNameKey} style={styles.page}>
              {/* Direction Title */}
              <Text style={styles.groupTitle}>
                Direction: {directionNameKey} ({index + 1}/{directionNames.length})
              </Text>

              {/* Vertical ScrollView for items within this direction */}
              {/* This ScrollView needs flex: 1 to take up the remaining space */}
              <ScrollView contentContainerStyle={styles.itemsListContainer} nestedScrollEnabled={true}>
                {/* Map over items for this specific direction */}
                {finalGroupedData[directionNameKey].map((item, itemIndex) => (
                  <Pressable key={item.id} style={styles.itemContainer} onPress={() => handleItemPress(directionNameKey, itemIndex)}>
                      <View style={styles.generalInfoContainer}>
                        <Text style={styles.itemRouteText}>
                          {item.routes?.code} | {item.routes?.name || item.routes?.code || 'N/A'}
                        </Text>
                        <Text style={styles.itemVehicleText}>
                          {item.vehicle_code || 'N/A'}
                        </Text>
                      </View>

                      <View style={styles.arrowContainer}>
                        <Text style={styles.arrowText}>➜</Text>
                        <Text style={styles.notesLabel}>{calculateDuration(item)}</Text>
                      </View>

                      <View style={styles.stopTimeBlock}>
                        <Text style={styles.stopNameText}>{item.last_stop_id?.name || 'N/A'}</Text>
                          <Text style={styles.timeText}>
                             {item.bus_initial_departure ? formatDate(new Date(item.bus_initial_departure)) : 'N/A'}
                          </Text>
                        </View>

                        <View style={styles.arrowContainer}>
                          <Text style={styles.arrowText}>➜</Text>
                        </View>

                        <View style={styles.stopTimeBlock}>
                          <Text style={styles.stopLabel}>To:</Text>
                          <Text style={styles.stopNameText}>{item.last_stop_id?.name || 'N/A'}</Text>
                           <Text style={styles.timeText}>
                             {item.bus_final_arrival ? formatDate(new Date(item.bus_final_arrival)) : 'N/A'}
                           </Text>
                        </View>
                      </View>

                      {item.notes && (
                        <View style={styles.notesContainer}>
                            <Text style={styles.notesLabel}>Notes:</Text>
                          <Text style={styles.notesText}>
                            {item.notes}
                          </Text>
                        </View>
                      )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ))}
        </PagerView>
      ) : (
        <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data available to display.</Text>
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
  page: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
    paddingBottom: 10,
    textAlign: 'center',
    marginBottom: 15,
  },
  itemsListContainer: {
    gap: 15,
  },
  itemContainer: {
    padding: 15,
    marginHorizontal: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  generalInfoContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    paddingBottom: 10,
  },
  itemRouteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 4,
    textAlign: 'center',
  },
    itemVehicleText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  stopsAndTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
  },
  stopTimeBlock: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
  },
  stopLabel: {
      fontSize: 12,
      color: '#555',
      fontWeight: 'bold',
      marginBottom: 2,
  },
  stopNameText: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 5,
      textAlign: 'center',
  },
  timeLabel: {
      fontSize: 12,
      color: '#555',
      fontWeight: 'bold',
      marginBottom: 2,
  },
  timeText: {
      fontSize: 14,
      color: '#3498db',
      fontWeight: '500',
  },
  arrowContainer: {
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
  },
  arrowText: {
      fontSize: 20,
      color: '#7f8c8d',
  },
  notesContainer: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#dcdcdc',
  },
  notesLabel: {
       fontSize: 12,
       color: '#555',
       fontWeight: 'bold',
       marginBottom: 4,
  },
  notesText: {
      fontSize: 14,
      fontStyle: 'italic',
      color: '#555',
  },
  noDataContainer: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
   },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
});

export default GroupedDataDisplay;