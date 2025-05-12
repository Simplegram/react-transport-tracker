import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'; // Adjust path as needed
import { router } from 'expo-router'; // Keep if needed elsewhere

import { useTravelContext } from '@/context/PageContext';
import Button from '@/components/BaseButton';

interface ButtonConfig {
    id: string
    text: string; // The button label
}

const navigationButtons: ButtonConfig[] = [
  { 
    id: 'Directions', 
    text: 'Manage direction',
  },
  {
    id: 'Stops', 
    text: 'Manage stop',
  },
  {
    id: 'Routes', 
    text: 'Manage route',
  },
  {
    id: 'VehicleTypes', 
    text: 'Manage vehicle type',
  },
  {
    id: 'Icons', 
    text: 'Manage icons',
  },
];


const NavigationPage: React.FC = () => {
  const { setSelectedModification } = useTravelContext()

  const handleItemPress = ( selectedModification: string ) => {
    // Access the item from the correctly grouped/sorted data
    if (selectedModification) {
        setSelectedModification(selectedModification);
        router.push("/(tabs)/dataList");
    }
  };

  return (
    <CollapsibleHeaderPage
      largeHeaderText="Add vehicle type, direction, stops, routes, or travels"
      smallHeaderText="Add Page"
    >
      <View style={styles.container}>
        <View style={styles.fillingContainer}></View>
        <View style={styles.buttonContainer}>
          {navigationButtons.map((button) => (
            <Button 
              color='#007bff'
              key={button.text} 
              title={button.text} 
              style={styles.button} 
              textStyle={styles.buttonText}
              onPress={() => handleItemPress(button.id)} 
            />
          ))}
        </View>
      </View>
    </CollapsibleHeaderPage>
  );
};

// --- Styles specific to the NavigationPage's content ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fillingContainer: {
    flex: 1,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

// --- Styles specific to the Modal Overlay and the MAIN content box ---
const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    justifyContent: 'flex-end', // Push the modal content to the bottom
  },
  keyboardAvoidingContainer: {
     // Adjust behavior based on platform. For bottom sheet,
     // often setting flex: 0 or letting content size it works,
     // but 'padding' or 'height' behavior is key.
     // flex: 1, // Use flex:1 if the content area itself needs to expand
  },
  modalContent: {
    backgroundColor: '#fff', // White background for the dialog box
    padding: 20, // Padding around the specific content component
    borderTopLeftRadius: 20, // Rounded corners at the top
    borderTopRightRadius: 20,
    width: '100%', // Make it full width
    // Add elevation for Android shadow if needed
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
        },
        android: {
            elevation: 10,
        },
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15, // Space below title, above content component
    textAlign: 'center',
  },
});

export default NavigationPage;