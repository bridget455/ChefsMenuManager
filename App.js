import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  // states hold what the chef types in the form.
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');

  // State holds every item of the menu that has been added so far.
  const [menuItems, setMenuItems] = useState([]);

  const handleAddItem = () => {
    // Validation: checks if the required fields are filled in correctly.
    if (!dishName.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Missing Information', 'Please fill in every field before saving.');
      return;
    }

    // Validation: checks the price to see if it's a valid positive number.
    if (isNaN(price) || Number(price) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price greater than 0.');
      return;
    }

    const newItem = {
      id: Date.now().toString(), // simple unique id
      dishName,
      description,
      course,
      price: parseFloat(price).toFixed(2),
    };

    // Adding the new item to an existing list.
    setMenuItems([...menuItems, newItem]);

    // Clearing the form so it's ready for the next dish
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');

    Alert.alert('Success', `${newItem.dishName} has been added to the menu!`);
  };

  // How each item of the menu looks in the list.
  const renderItem = ({ item }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemHeader}>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <Text style={styles.price}>R{item.price}</Text>
      </View>
      <Text style={styles.course}>{item.course}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Christoffel's Menu Manager</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Dish Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Grilled Salmon"
          value={dishName}
          onChangeText={setDishName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Served with lemon butter sauce"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Course</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={course} onValueChange={(value) => setCourse(value)}>
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        <Text style={styles.label}>Price (R)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 120"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddItem}>
          <Text style={styles.buttonText}>Save Menu Item</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Menu Items ({menuItems.length})</Text>

      {menuItems.length === 0 ? (
        <Text style={styles.emptyText}>No menu items yet. Add your first dish above!</Text>
      ) : (
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2', paddingHorizontal: 16, paddingTop: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2E2E2E', textAlign: 'center', marginBottom: 16 },
  form: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 20, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 4, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 15, backgroundColor: '#fdfdfd' },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#fdfdfd' },
  button: { backgroundColor: '#B5651D', paddingVertical: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#2E2E2E' },
  emptyText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: 20 },
  list: { flex: 1 },
  menuItem: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, elevation: 1 },
  menuItemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  dishName: { fontSize: 16, fontWeight: 'bold', color: '#2E2E2E' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#B5651D' },
  course: { fontSize: 13, color: '#777', marginTop: 2, marginBottom: 4 },
  description: { fontSize: 14, color: '#444' },
});