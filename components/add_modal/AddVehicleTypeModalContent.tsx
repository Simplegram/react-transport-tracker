// src/components/AddVehicleTypeModalContent.tsx (Create this file)
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Make sure you have installed this package
import { BaseModalContentProps } from '@/src/types/ModalContentProps'; // Adjust path
import Button from '../BaseButton';

// You'll need to install @react-native-picker/picker
// npm install @react-native-picker/picker
// or yarn add @react-native-picker/picker

// For iOS, you might need to install pods: cd ios && pod install

const vehicleOptions = [
    { label: 'Bus', value: 'bus' },
    { label: 'Tram', value: 'tram' },
    { label: 'Subway Car', value: 'subway_car' },
    { label: 'Train', value: 'train' },
];

const AddVehicleTypeModalContent: React.FC<BaseModalContentProps> = ({ onSubmit, onCancel }) => {
  const [typeName, setTypeName] = useState('');

  const handleAddPress = () => {
    if (!typeName.trim()) {
      Alert.alert('Input Required', 'Please enter a type name and select a type.');
      return;
    }
    // Pass both fields back
    onSubmit({ name: typeName });
  };

  return (
    <View style={contentStyles.container}>
      <Text style={contentStyles.label}>Type Name:</Text>
      <TextInput
        style={contentStyles.input}
        placeholder="e.g., Standard Bus"
        value={typeName}
        onChangeText={setTypeName}
        autoFocus={true}
      />

      {/* Buttons for this specific content */}
      <View style={contentStyles.buttonRow}>
        <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={contentStyles.cancelButton} textStyle={contentStyles.cancelButtonText}></Button>
        <Button title='Add Vehicle Type' color='#0284f5' onPress={handleAddPress} style={contentStyles.addButton} textStyle={contentStyles.addButtonText}></Button>
      </View>
    </View>
  );
};

// Use the same contentStyles or define new ones if needed
const contentStyles = StyleSheet.create({
    container: {
        // No specific flex/dimensions needed usually
    },
   label: {
     fontSize: 16,
     marginBottom: 5,
     fontWeight: 'bold',
   },
   input: {
     borderWidth: 1,
     borderColor: '#ccc',
     borderRadius: 5,
     paddingHorizontal: 10,
     paddingVertical: 10,
     fontSize: 16,
     marginBottom: 15,
   },
   pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        // Adjust padding if needed, Picker itself adds some
        // On Android, you might need to adjust height
        ...Platform.select({
            android: {
                padding: 0, // Remove default padding on Android
                height: 50, // Give it a specific height
                justifyContent: 'center', // Center content vertically
            },
             ios: {
                 // Default padding is usually fine on iOS
             }
        })
   },
   buttonRow: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     marginTop: 10,
     gap: 10,
   },
   addButton: {
     backgroundColor: '#1E88E5',
     paddingVertical: 12,
     borderRadius: 8,
     flex: 1,
     alignItems: 'center',
   },
   addButtonText: {
     color: '#fff',
     fontSize: 16,
     fontWeight: '600',
   },
   cancelButton: {
     paddingVertical: 12,
     borderRadius: 8,
     flex: 1,
     alignItems: 'center',
   },
   cancelButtonText: {
     color: '#000',
     fontSize: 16,
     fontWeight: '600',
   },
});

export default AddVehicleTypeModalContent;