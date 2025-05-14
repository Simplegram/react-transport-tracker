import CollapsibleHeaderPage from "@/components/CollapsibleHeaderPage";
import useTravelCalendar from "@/hooks/useTravelCalendar";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Calendar } from 'react-native-calendars';
import GroupedDataDisplay from "@/components/GroupedTravelsDisplay";
import { useFocusEffect } from "expo-router";

const { height: screenHeight } = Dimensions.get('window');

interface DateObject {
  dateString: string,
  day: number,
  month: number,
  timestamp: number,
  year: number
}

// --- Helper to get today's date string ---
const getTodayString = () => {
  const todaysDate = new Date().toISOString().split('T')[0].toString();
  return todaysDate
};

export default function HomePage() {
  const { 
    travelAtDate, getTravelAtDate, getDates,
    dates, selectedDate, setSelectedDate,
  } = useTravelCalendar()

  // Generate marked dates for the calendar
  const markedDates = useMemo(() => {
    const marked: any = {};

    // Mark dates that have items
    dates.forEach(date => {
      marked[date] = {
        ...marked[date], // Preserve any existing marking (like 'selected')
        marked: true,
        color: '#dcf8c6',
      };
    });

    // Mark the selected date distinctly
    marked[selectedDate] = {
      ...marked[selectedDate], // Preserve any item marking
      selected: true,
      selectedColor: '#00adf5', // Blue background for selected date
      selectedTextColor: 'white',
    };

    return marked;
  }, [selectedDate, dates]);

  const onDayPress = (day: DateObject) => {
    setSelectedDate(day.dateString);
  };

  useEffect(() => {
    getDates()
  }, [dates])

  useFocusEffect(
    React.useCallback(() => {
      getDates()
      getTravelAtDate()
    }, [dates])
  )

  return (
    <CollapsibleHeaderPage largeHeaderText="Public Transport Tracker">
      <View style={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            onDayPress={onDayPress}
            initialDate={getTodayString()}
            enableSwipeMonths={true}
            theme={{
              // Customize calendar theme if needed
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              arrowColor: '#00adf5',
              indicatorColor: '#00adf5',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
          />
        </View>

        <View style={styles.listContainer}>
          <GroupedDataDisplay data={travelAtDate}></GroupedDataDisplay>
        </View>
      </View>
    </CollapsibleHeaderPage>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  listContainer: {
    flex: 1,
    minHeight: screenHeight * 0.48,
    maxHeight: screenHeight * 0.9,
    paddingTop: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  listContent: {
    flexGrow: 1,
  },
  listItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  noItemsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});