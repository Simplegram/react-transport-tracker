import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { BaseModalContentProps } from '@/src/types/ModalContentProps'; // Adjust path
import Button from '@/components/BaseButton';
import Icon from 'react-native-vector-icons/FontAwesome6'

// Make sure these icon names match the ones available in your icon library
const iconSelection = ['train', 'train-subway', 'train-tram', 'car', 'truck-front', 'plane-up', 'motorcycle', 'person-walking'];

const AddVehicleTypeModalContent: React.FC<BaseModalContentProps> = ({ onSubmit, onCancel }) => {
  const [typeName, setTypeName] = useState('');
  // Initialize with the first icon, but allow null if you want an explicit "Select an Icon" step
  const [selectedIcon, setSelectedIcon] = useState<string | null>(iconSelection[0]);

  const handleAddPress = () => {
    if (!typeName.trim() || !selectedIcon) {
      Alert.alert('Input Required', 'Please enter a type name and select an icon.');
      return;
    }
    onSubmit({ name: typeName, icon: selectedIcon });
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

      <Text style={contentStyles.label}>Select Icon:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={contentStyles.iconScrollView}>
        {iconSelection.map((icon) => (
          <TouchableOpacity
            key={icon}
            style={[
              contentStyles.iconContainer,
              selectedIcon === icon && contentStyles.selectedIconContainer,
            ]}
            onPress={() => setSelectedIcon(icon)}
          >
            <Icon name={icon} size={20}></Icon>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={contentStyles.buttonRow}>
        <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={contentStyles.cancelButton} textStyle={contentStyles.cancelButtonText}></Button>
        <Button title='Add Vehicle Type' color='#0284f5' onPress={handleAddPress} style={contentStyles.addButton} textStyle={contentStyles.addButtonText}></Button>
      </View>
    </View>
  );
};

const contentStyles = StyleSheet.create({
  container: {

  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  iconScrollView: {
    marginBottom: 20,
  },
  iconContainer: {
    width: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 5,
    marginRight: 10, // Space between icons
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    borderColor: '#0284f5', // Highlight selected icon
    backgroundColor: '#e3f2fd', // Light background for selected
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