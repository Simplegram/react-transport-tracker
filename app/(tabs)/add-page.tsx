import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
// Make sure the path is correct relative to your project structure
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'; // Adjust path as needed
import { router } from 'expo-router';

// Define the data for the navigation buttons
// Replace with your actual URLs or internal route names if using React Navigation
const navigationButtons = [
  { text: 'Add direction', href: '/inputs/vehicle-input' },
  { text: 'Add stop', href: '/inputs/vehicle-input' },
  { text: 'Add route', href: '/inputs/vehicle-input' },
  { text: 'Add vehicle type', href: '/inputs/vehicle-input' },
];

const NavigationPage: React.FC = () => {

  // Handler function for button presses (reused from the previous example)
  const handleButtonPress = async (url: string) => {
    try {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Could not open: ${url}`, 'The link is not supported or your device cannot open it.');
            console.error(`Failed to open URL: ${url}`);
        }
    } catch (error) {
        Alert.alert(`An error occurred`, `Could not open link: ${url}`);
        console.error('Linking error:', error);
    }
  };


  return (
    <CollapsibleHeaderPage
      largeHeaderText="Add vehicle type, direction, stops, routes, or travels"
      smallHeaderText="Add Page" // A suitable small header text
      // You could add style props here for the base layout if needed
    >
      <View>
        <View style={pageStyles.buttonContainer}>
          {navigationButtons.map((button, index) => (
              <TouchableOpacity
                  key={index} // Use a unique key if possible, index is okay for static lists
                  style={pageStyles.button}
                  onPress={() => router.push(button.href)} // Call the handler with the URL
                  activeOpacity={0.8} // Provide touch feedback
              >
                  <Text style={pageStyles.buttonText}>{button.text}</Text>
              </TouchableOpacity>
          ))}
          {navigationButtons.map((button, index) => (
              <TouchableOpacity
                  key={index} // Use a unique key if possible, index is okay for static lists
                  style={pageStyles.button}
                  onPress={() => router.push(button.href)} // Call the handler with the URL
                  activeOpacity={0.8} // Provide touch feedback
              >
                  <Text style={pageStyles.buttonText}>{button.text}</Text>
              </TouchableOpacity>
          ))}
          {navigationButtons.map((button, index) => (
              <TouchableOpacity
                  key={index} // Use a unique key if possible, index is okay for static lists
                  style={pageStyles.button}
                  onPress={() => router.push(button.href)} // Call the handler with the URL
                  activeOpacity={0.8} // Provide touch feedback
              >
                  <Text style={pageStyles.buttonText}>{button.text}</Text>
              </TouchableOpacity>
          ))}
        </View>
      </View>
    </CollapsibleHeaderPage>
  );
};

// --- Styles specific to the NavigationPage's content ---
const pageStyles = StyleSheet.create({
  // Note: CollapsibleHeaderPage's scrollContentInner provides horizontal padding,
  // so you might not need explicit horizontal padding here unless you have
  // nested views that need it.
  buttonContainer: {
    // Optional: add styles here if you want buttons in a row, or specific spacing
    // For stacked buttons, a simple View wrapper is sufficient for margins between them
  },
  button: {
    backgroundColor: '#1E88E5', // A different blue for variation (Material Blue 600)
    paddingVertical: 14, // Slightly more padding
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center', // Center text horizontally within the button
    marginTop: 12, // Space between stacked buttons
  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 17, // Slightly larger font
    fontWeight: '700', // Bolder font
  },
  dummyContent: {
    height: 300, // Make it tall enough to scroll
    backgroundColor: '#e0e0e0', // Lighter background
    marginTop: 30, // Space above the dummy content
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center', // Center dummy text vertically
    alignItems: 'center', // Center dummy text horizontally
  }
});

export default NavigationPage;