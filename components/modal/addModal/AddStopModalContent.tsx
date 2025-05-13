// src/components/AddStopModalContent.tsx (Create this file)
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BaseModalContentProps, AddStopData } from '@/src/types/ModalContentProps'; // Adjust path
import Button from '@/components/BaseButton';

const AddStopModalContent: React.FC<BaseModalContentProps> = ({ onSubmit, onCancel }) => {
  const [stopName, setStopName] = useState('');
  const [stopLocation, setStopLocation] = useState(''); // New state for location

  const handleOnSubmit = () => {
    if (!stopName.trim() || !stopLocation.trim()) {
      Alert.alert('Input Required', 'Please enter both stop name and location.');
      return;
    }
    // Pass multiple data fields back
    onSubmit({ name: stopName, location: stopLocation } as AddStopData);
  };

  return (
    <View style={contentStyles.container}>
      <Text style={contentStyles.label}>Stop Name:</Text>
      <TextInput
        style={contentStyles.input}
        placeholder="e.g., Main Street & 1st Ave"
        value={stopName}
        onChangeText={setStopName}
        autoFocus={true}
      />

      <Text style={contentStyles.label}>Location:</Text>
      <TextInput
        style={contentStyles.input}
        placeholder="e.g., Coordinates, Description"
        value={stopLocation}
        onChangeText={setStopLocation}
      />

      <View style={contentStyles.buttonRow}>
        <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={contentStyles.cancelButton} textStyle={contentStyles.cancelButtonText}></Button>
        <Button title='Add Stop' color='#0284f5' onPress={handleOnSubmit} style={contentStyles.addButton} textStyle={contentStyles.addButtonText}></Button>
      </View>
    </View>
  );
};

// Use the same contentStyles or define new ones if needed
const contentStyles = StyleSheet.create({
    // No specific flex/dimensions needed usually, content wraps
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
    marginBottom: 15, // Space after each input
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 10,
  },
  addButton: {
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

export default AddStopModalContent;