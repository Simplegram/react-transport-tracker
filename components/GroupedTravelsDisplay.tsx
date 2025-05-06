import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { DataItem } from '@/src/types/Travels'; // Import the interface from your specified path
import { TravelContext, useTravelContext } from '@/context/PageContext';
import { router, useNavigation } from 'expo-router';

interface GroupedDataDisplayProps {
  data: DataItem[];
}

function formatDate(
  date: Date, 
  custom_hours: number | null = null, 
  custom_minutes: number | null = null, 
  custom_seconds: number | null = null
) {
  // Create a new Date object if one wasn't passed in
  if (!date) {
    date = new Date();
  }

  // Ensure we're working with a Date object
  if (!(date instanceof Date)) {
    return "Invalid Date"; // Or handle the error in a way that suits your needs
  }

  const hours = custom_hours ?? String(date.getHours()).padStart(2, '0');
  const minutes = custom_minutes ?? String(date.getMinutes()).padStart(2, '0');
  const seconds = custom_seconds ?? String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

const GroupedDataDisplay: React.FC<GroupedDataDisplayProps> = ({ data }) => {
  const { setSelectedItem } = useTravelContext()
  const navigation = useNavigation()

  // Group the data by direction's name
  const groupedData = data.reduce((acc, currentItem) => {
    const directionName = currentItem.directions?.name || 'Unassigned Direction';
    const directionKey = directionName;

    if (!acc[directionKey]) {
      acc[directionKey] = [];
    }
    acc[directionKey].push(currentItem);
    return acc;
  }, {} as Record<string, DataItem[]>);

  // 2. Sort the items within each group by initial_arrival time
  const sortedGroupedData: Record<string, DataItem[]> = {};

  Object.keys(groupedData).forEach(directionKey => {
      sortedGroupedData[directionKey] = groupedData[directionKey].sort((a, b) => {
          // Convert times to Date objects for comparison.
          // Handle potential null/undefined arrival times by placing them at the end.
          const timeA = a.bus_initial_arrival ? new Date(a.bus_initial_arrival).getTime() : Infinity;
          const timeB = b.bus_initial_departure ? new Date(b.bus_initial_departure).getTime() : Infinity;

          // Compare the times
          return timeA - timeB;
      });
  });

  // Get the keys (direction names) and sort them
  const directionNames = Object.keys(groupedData).sort();

  const setIndexes = (directionNameKey: string, itemIndex: number) => {
    setSelectedItem(groupedData[directionNameKey][itemIndex])
    router.push("/(tabs)/editTravelItem")
  }

  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      {directionNames.length > 0 ? (
        directionNames.map((directionNameKey) => (
          <View key={directionNameKey} style={styles.groupContainer}>
            {/* Display the direction name */}
            <Text style={styles.groupTitle}>
              Direction: {directionNameKey}
            </Text>
            <View style={styles.itemsListContainer}>
              {/* Loop through items in this direction group */}
              {groupedData[directionNameKey].map((item, itemIndex) => (
                <View key={item.id} style={styles.itemContainer}>
                  <Pressable onPress={() => setIndexes(directionNameKey, itemIndex)}>
                    {/* Top section: Route and Vehicle Code */}
                    <View style={styles.generalInfoContainer}>
                      <Text style={styles.itemRouteText}>
                        {item.routes?.code} | {item.routes?.name || item.routes?.code || 'N/A'}
                      </Text>
                      <Text style={styles.itemVehicleText}>
                        {item.vehicle_code || 'N/A'}
                      </Text>
                    </View>

                    {/* Middle section: Stops, Times, and Arrow */}
                    <View style={styles.stopsAndTimeRow}>
                      {/* First Stop and Initial Arrival */}
                      <View style={styles.stopTimeBlock}>
                        <Text style={styles.stopLabel}>From:</Text>
                        <Text style={styles.stopNameText}>{item.first_stop_id?.name || 'N/A'}</Text>
                        <Text style={styles.timeText}>{formatDate(new Date(item.bus_initial_departure)) || 'N/A'}</Text>
                        {/* Note: Using initial_arrival/departure as per your interface names.
                            If you need bus_initial_arrival/departure as per your sample output,
                            update the interface and use those field names here. */}
                      </View>

                      {/* Arrow */}
                      <View style={styles.arrowContainer}>
                        {/* Unicode right arrow character */}
                        <Text style={styles.arrowText}>➜</Text>
                        {/* Or a simple ASCII arrow like '>' or '->' */}
                        {/* <Text style={styles.arrowText}>--{'>'}</Text> */}
                      </View>

                      {/* Last Stop and Initial Departure */}
                      <View style={styles.stopTimeBlock}>
                        <Text style={styles.stopLabel}>To:</Text>
                        <Text style={styles.stopNameText}>{item.last_stop_id?.name || 'N/A'}</Text>
                        <Text style={styles.timeText}>{formatDate(new Date(item.bus_final_arrival)) || 'N/A'}</Text>
                      </View>
                    </View>

                    {/* Bottom section: Notes (if any) */}
                    {item.notes && (
                      <View style={styles.notesContainer}>
                          <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText}>
                          {item.notes}
                        </Text>
                      </View>
                    )}
                    {/* Item ID - maybe keep for debugging or remove in final design */}
                    {/* <Text style={styles.itemIdText}>ID: {item.id}</Text> */}
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ))
      ) : (
        // Handle case where data array is empty
        <Text style={styles.noDataText}>No data available to display.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12, // More rounded corners
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  groupTitle: {
    fontSize: 20, // Slightly larger title
    fontWeight: 'bold',
    marginBottom: 20, // More space below title
    color: '#2c3e50', // Darker title color
    borderBottomWidth: 2, // Thicker underline
    borderBottomColor: '#3498db', // Colored underline
    paddingBottom: 10,
    textAlign: 'center', // Center the title
  },
   itemsListContainer: {
    gap: 20,
    // No specific styles needed here, just holds the item containers
  },
  itemContainer: {
    // marginBottom: 20, // Space between items
    padding: 15, // More padding inside item
    backgroundColor: '#ecf0f1', // Light grey background for items
    borderRadius: 8,
    // Removed left border, maybe add a subtle all-around border
    borderWidth: 1,
    borderColor: '#bdc3c7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // --- Item Details Layout ---
  generalInfoContainer: {
      marginBottom: 10, // Space below general info
      borderBottomWidth: 1,
      borderBottomColor: '#dcdcdc', // Separator line
      paddingBottom: 10,
  },
  itemRouteText: {
    fontSize: 16,
    fontWeight: '600', // Semi-bold
    color: '#34495e', // Dark text
    marginBottom: 4,
  },
    itemVehicleText: {
    fontSize: 14,
    color: '#7f8c8d', // Muted text
  },
  stopsAndTimeRow: {
      flexDirection: 'row', // Arrange children horizontally
      alignItems: 'center', // Vertically center items in the row
      justifyContent: 'space-between', // Distribute space between items
      marginBottom: 10, // Space below this section
  },
  stopTimeBlock: {
      flex: 1, // Allow blocks to take up available space equally
      paddingVertical: 8,
      // backgroundColor: '#f0f0f0', // Optional: background for clarity
      borderRadius: 4,
      // borderWidth: 1, // Optional: border for clarity
      // borderColor: '#ccc',
  },
  stopLabel: {
      fontSize: 12,
      color: '#555',
      fontWeight: 'bold',
      marginBottom: 2,
  },
  stopNameText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 5, // Space between stop name and time
  },
  timeLabel: {
       fontSize: 12,
      color: '#555',
      fontWeight: 'bold',
      marginBottom: 2,
  },
  timeText: {
      fontSize: 14,
      color: '#3498db', // Blue color for times
      fontWeight: '500',
  },
  arrowContainer: {
      paddingHorizontal: 10, // Space around the arrow
      justifyContent: 'center', // Center arrow vertically (redundant with alignItems on parent, but good practice)
      alignItems: 'center', // Center arrow horizontally
  },
  arrowText: {
      fontSize: 20, // Size of the arrow
      color: '#7f8c8d', // Muted color for the arrow
  },
  notesContainer: {
      marginTop: 10, // Space above notes
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#dcdcdc', // Separator line above notes
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
  // --- Other Styles ---
  itemIdText: { // Retained but commented out in render
    fontSize: 10,
    color: '#aaa',
    textAlign: 'right',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default GroupedDataDisplay;