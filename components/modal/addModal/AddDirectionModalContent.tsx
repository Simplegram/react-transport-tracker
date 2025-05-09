// src/components/AddDirectionModalContent.tsx (Create this file)
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BaseModalContentProps, AddDirectionData } from '@/src/types/ModalContentProps'; // Adjust path
import Button from '@/components/BaseButton';

// Important: This component will ONLY render the form fields and its own internal buttons
// The outer modal styling (backdrop, slide-up, etc.) is handled by the parent
const AddDirectionModalContent: React.FC<BaseModalContentProps> = ({ onSubmit, onCancel }) => {
  const [directionName, setDirectionName] = useState('');

  const handleAddPress = () => {
    if (!directionName.trim()) {
      Alert.alert('Input Required', 'Please enter a direction name.');
      return;
    }
    // Call the onSubmit prop, passing the collected data as an object
    onSubmit({ name: directionName } as AddDirectionData);
    // onSubmit will also handle closing the modal
  };

  return (
    <View style={contentStyles.container}>
      <Text style={contentStyles.label}>Direction Name:</Text>
      <TextInput
        style={contentStyles.input}
        placeholder="e.g., Northbound"
        value={directionName}
        onChangeText={setDirectionName}
        autoFocus={true} // Auto-focus when this content is shown
      />

      <View style={contentStyles.buttonRow}>
        <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={contentStyles.cancelButton} textStyle={contentStyles.cancelButtonText}></Button>
        <Button title='Add Direction' color='#0284f5' onPress={handleAddPress} style={contentStyles.addButton} textStyle={contentStyles.addButtonText}></Button>
      </View>
    </View>
  );
};

const contentStyles = StyleSheet.create({
  container: {
    
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
    marginBottom: 15, // Space after input
  },
   buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10, // Space above buttons
    gap: 10,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    // marginHorizontal: 5,
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


export default AddDirectionModalContent;