import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import Button from '@/components/BaseButton';
import LoadingScreen from '@/components/LoadingScreen';
import useDataList from '@/hooks/useDataList';

interface DataItem {
  id: string | number; // Use a unique ID
  name: string; // Or title, description, etc.
  [key: string]: any; // Allow for other properties specific to the item type
}

const DataListScreen: React.FC = () => {
  const {
    dataType,
    filteredData: data,
    searchQuery, setSearchQuery,
    loading,
  } = useDataList()

  const handleModify = (item: DataItem) => {
    console.log(`Modify ${dataType} item:`, item);
    Alert.alert(`Modify ${dataType}`, `You pressed modify for: ${item.name}`);
  };

  const handleAddNew = () => {
    console.log(`Add New ${dataType}`);
    Alert.alert(`Add New ${dataType}`, `You pressed Add New for: ${dataType}`);
  };

  const renderItem = ({ item }: { item: DataItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        {item.code ? <Text style={[styles.itemName, {color: '#007bff'}]}>{item.code}</Text> : null}
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.fillerContainer}></View>
        <TouchableOpacity
          style={styles.modifyButton}
          onPress={() => handleModify(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.modifyButtonText}>Modify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <LoadingScreen text="Loading..." />
    );
  }

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No {dataType} found.</Text>
        </View>

      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()} // Ensure key is a string
          contentContainerStyle={styles.listContent}
        />
      )}

      <TextInput
        style={styles.modalSearchInput}
        placeholder={`Search ${dataType}...`}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus={true}
      />

      <View style={styles.addButtonContainer}>
        <Button
          color='#007bff'
          title={`Add New ${dataType}`}
          onPress={handleAddNew}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 10,
  },
  fillerContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'column',
  },
  itemContainer: {
    padding: 10,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#000',
    gap: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modifyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContent: {
    gap: 10,
  },
  addButtonContainer: {

  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  button: {
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  modalSearchInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default DataListScreen;