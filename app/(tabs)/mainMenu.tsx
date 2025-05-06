import CollapsibleHeaderPage from "@/components/CollapsibleHeaderPage";
import useTravels from "@/hooks/useTravels";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar } from 'react-native-calendars';
import GroupedDataDisplay from "@/components/GroupedTravelsDisplay";

const { height: screenHeight } = Dimensions.get('window');

// --- Type Definitions ---
interface ReminderItem {
  id: string;
  text: string;
}

interface RemindersData {
  [date: string]: ReminderItem[]; // Key is 'YYYY-MM-DD'
}

interface DateObject {
  dateString: string,
  day: number,
  month: number,
  timestamp: number,
  year: number
}

// --- Sample Data ---
const initialReminders: RemindersData = {
  '2025-05-26': [
    { id: '1', text: 'Buy groceries' }, 
    { id: '2', text: 'Call Mom' },
  ],
  '2025-05-28': [{ id: '3', text: 'Meeting at 2 PM' }],
  '2025-05-30': [{ id: '4', text: 'Project deadline' }],
  '2025-05-05': [{ id: '5', text: 'Doctor appointment' }],
  '2025-05-10': [{ id: '6', text: 'Plan weekend trip' }],
  // Add more sample data as needed
};

// --- Helper to get today's date string ---
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export default function HomePage() {
  // const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [reminders, setReminders] = useState<RemindersData>(initialReminders);

  const { selectedDate, travelAtDate, setSelectedDate } = useTravels()

  // Items to display in the list for the selected date
  const itemsForSelectedDate = useMemo(async () => {
    return reminders[selectedDate] || [];
  }, [selectedDate]);

  // Generate marked dates for the calendar
  const markedDates = useMemo(() => {
    const marked: any = {};

    // Mark dates that have items
    Object.keys(reminders).forEach(date => {
      if (reminders[date].length > 0) {
        marked[date] = {
          ...marked[date], // Preserve any existing marking (like 'selected')
          customStyles: {
            container: {
              backgroundColor: '#dcf8c6', // Light green background for dates with items
              borderRadius: 16, // Make it a circle/rounded square
            },
            text: {
              color: 'black',
            },
          },
        };
      }
    });

    // Mark the selected date distinctly
    marked[selectedDate] = {
      ...marked[selectedDate], // Preserve any item marking
      selected: true,
      selectedColor: '#00adf5', // Blue background for selected date
      selectedTextColor: 'white',
      // Overwrite custom styles if needed, or let 'selected' take priority
      // For example, remove customStyles if selected should always be standard blue:
      // customStyles: undefined,
    };


    return marked;
  }, [selectedDate, reminders]);

  const onDayPress = (day: DateObject) => {
    setSelectedDate(day.dateString);
  };

  return (
    <CollapsibleHeaderPage largeHeaderText="Public Transport Tracker">
      <View style={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar
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
          {itemsForSelectedDate.length === 0 ? (
            <Text style={styles.noItemsText}>No items for this date.</Text>
          ) : (
            <GroupedDataDisplay data={travelAtDate}></GroupedDataDisplay>
          )}
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
    height: screenHeight * 0.48,
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
    // Add padding or margin if needed for FlatList content
  },
  listItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
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