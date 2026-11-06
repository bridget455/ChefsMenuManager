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
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// The three courses the chef can choose from. Kept in one place so every
// part of the app (the form, the filter buttons, the statistics) uses the
// exact same list instead of typing "Starter", "Main Course", "Dessert"
// over and over.
const COURSES = ['Starter', 'Main Course', 'Dessert'];

// ---------------------------------------------------------------------
// Reusable component: one row of labelled input used by both the "Add"
// form and the "Edit" form, so we don't write the same TextInput +
// label markup twice.
// ---------------------------------------------------------------------
function LabelledInput({ label, ...inputProps }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...inputProps} />
    </View>
  );
}

// ---------------------------------------------------------------------
// Reusable component: the small card shown for each dish in the menu
// list, with its Edit and Delete buttons.
// ---------------------------------------------------------------------
function MenuItemCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuItemHeader}>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <Text style={styles.price}>R{item.price}</Text>
      </View>
      <Text style={styles.course}>{item.course}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.cardButtonRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------
// Reusable component: the small statistics bar at the top of the menu
// list (total items, average price, items per course).
// ---------------------------------------------------------------------
function MenuStatistics({ menuItems }) {
  const totalItems = menuItems.length;

  const averagePrice =
    totalItems === 0
      ? '0.00'
      : (
          menuItems.reduce((sum, item) => sum + Number(item.price), 0) / totalItems
        ).toFixed(2);

  // Count how many items belong to each course, e.g. { Starter: 2, 'Main Course': 1, Dessert: 0 }
  const countsByCourse = COURSES.reduce((counts, courseName) => {
    counts[courseName] = menuItems.filter((item) => item.course === courseName).length;
    return counts;
  }, {});

  return (
    <View style={styles.statsBox}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalItems}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>R{averagePrice}</Text>
          <Text style={styles.statLabel}>Average Price</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        {COURSES.map((courseName) => (
          <View style={styles.statItem} key={courseName}>
            <Text style={styles.statValue}>{countsByCourse[courseName]}</Text>
            <Text style={styles.statLabel}>{courseName}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function App() {
  // Holds what the chef types into the "Add Menu Item" form.
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');

  // Holds every menu item that has been added so far.
  const [menuItems, setMenuItems] = useState([]);

  // Holds the text typed into the search box.
  const [searchQuery, setSearchQuery] = useState('');

  // Holds which course filter button is currently selected ('All',
  // 'Starter', 'Main Course' or 'Dessert').
  const [activeFilter, setActiveFilter] = useState('All');

  // Holds the item currently being edited (null when nothing is being
  // edited, so the Edit modal stays hidden).
  const [editingItem, setEditingItem] = useState(null);
  const [editDishName, setEditDishName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCourse, setEditCourse] = useState('Starter');
  const [editPrice, setEditPrice] = useState('');

  // Reusable validation, used by both "Add" and "Edit" so the same rules
  // apply everywhere instead of being written out twice.
  const validateFields = (name, desc, priceValue) => {
    if (!name.trim() || !desc.trim() || !priceValue.trim()) {
      Alert.alert('Missing Information', 'Please fill in every field before saving.');
      return false;
    }
    if (isNaN(priceValue) || Number(priceValue) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price greater than 0.');
      return false;
    }
    return true;
  };

  const handleAddItem = () => {
    if (!validateFields(dishName, description, price)) return;

    const newItem = {
      id: Date.now().toString(), // simple unique id based on the current time
      dishName,
      description,
      course,
      price: parseFloat(price).toFixed(2),
    };

    setMenuItems([...menuItems, newItem]);

    // Clear the form so it's ready for the next dish.
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');

    Alert.alert('Success', `${newItem.dishName} has been added to the menu!`);
  };

  // Opens the Edit modal and pre-fills it with the selected item's info.
  const handleStartEdit = (item) => {
    setEditingItem(item);
    setEditDishName(item.dishName);
    setEditDescription(item.description);
    setEditCourse(item.course);
    setEditPrice(item.price.toString());
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleSaveEdit = () => {
    if (!validateFields(editDishName, editDescription, editPrice)) return;

    // Replace just the one item that matches the id being edited, leave
    // every other item in the list untouched.
    const updatedItems = menuItems.map((item) =>
      item.id === editingItem.id
        ? {
            ...item,
            dishName: editDishName,
            description: editDescription,
            course: editCourse,
            price: parseFloat(editPrice).toFixed(2),
          }
        : item
    );

    setMenuItems(updatedItems);
    setEditingItem(null);
    Alert.alert('Updated', `${editDishName} has been updated.`);
  };

  const handleDeleteItem = (item) => {
    Alert.alert(
      'Delete Menu Item',
      `Are you sure you want to delete "${item.dishName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems(menuItems.filter((menuItem) => menuItem.id !== item.id));
          },
        },
      ]
    );
  };

  // Builds the list that actually gets displayed: start with every item,
  // then narrow it down by the search text and the selected course filter.
  const visibleItems = menuItems
    .filter((item) =>
      item.dishName.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
    .filter((item) => activeFilter === 'All' || item.course === activeFilter);

  const handleClearSearchAndFilter = () => {
    setSearchQuery('');
    setActiveFilter('All');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Christoffel's Menu Manager</Text>

        {/* ---------- Add Menu Item form ---------- */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Add Menu Item</Text>

          <LabelledInput
            label="Dish Name"
            placeholder="e.g. Grilled Salmon"
            value={dishName}
            onChangeText={setDishName}
          />

          <LabelledInput
            label="Description"
            placeholder="e.g. Served with lemon butter sauce"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Course</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={course} onValueChange={setCourse}>
              {COURSES.map((courseName) => (
                <Picker.Item key={courseName} label={courseName} value={courseName} />
              ))}
            </Picker>
          </View>

          <LabelledInput
            label="Price (R)"
            placeholder="e.g. 120"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.button} onPress={handleAddItem}>
            <Text style={styles.buttonText}>Save Menu Item</Text>
          </TouchableOpacity>
        </View>

        {/* ---------- Statistics ---------- */}
        <MenuStatistics menuItems={menuItems} />

        {/* ---------- Search and filter ---------- */}
        <View style={styles.searchFilterBox}>
          <TextInput
            style={styles.input}
            placeholder="Search by dish name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.filterRow}>
            {['All', ...COURSES].map((filterName) => (
              <TouchableOpacity
                key={filterName}
                style={[
                  styles.filterButton,
                  activeFilter === filterName && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(filterName)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === filterName && styles.filterButtonTextActive,
                  ]}
                >
                  {filterName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {(searchQuery !== '' || activeFilter !== 'All') && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearchAndFilter}>
              <Text style={styles.clearButtonText}>Clear Search &amp; Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ---------- Menu list ---------- */}
        <Text style={styles.subtitle}>
          Menu Items ({visibleItems.length}
          {visibleItems.length !== menuItems.length ? ` of ${menuItems.length}` : ''})
        </Text>

        {menuItems.length === 0 ? (
          <Text style={styles.emptyText}>No menu items yet. Add your first dish above!</Text>
        ) : visibleItems.length === 0 ? (
          <Text style={styles.emptyText}>No menu items match your search or filter.</Text>
        ) : (
          <FlatList
            data={visibleItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <MenuItemCard item={item} onEdit={handleStartEdit} onDelete={handleDeleteItem} />
            )}
          />
        )}
      </ScrollView>

      {/* ---------- Edit Menu Item modal ---------- */}
      <Modal visible={editingItem !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.sectionTitle}>Edit Menu Item</Text>

              <LabelledInput
                label="Dish Name"
                value={editDishName}
                onChangeText={setEditDishName}
              />

              <LabelledInput
                label="Description"
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
              />

              <Text style={styles.label}>Course</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={editCourse} onValueChange={setEditCourse}>
                  {COURSES.map((courseName) => (
                    <Picker.Item key={courseName} label={courseName} value={courseName} />
                  ))}
                </Picker>
              </View>

              <LabelledInput
                label="Price (R)"
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E2E2E',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E2E2E', marginBottom: 10 },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  inputGroup: { marginBottom: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fdfdfd',
  },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#fdfdfd' },
  button: { backgroundColor: '#B5651D', paddingVertical: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { paddingVertical: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  cancelButtonText: { color: '#888', fontSize: 15, fontWeight: '600' },

  // Statistics
  statsBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#B5651D' },
  statLabel: { fontSize: 12, color: '#777', marginTop: 2, textAlign: 'center' },

  // Search and filter
  searchFilterBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
  filterButton: {
    borderWidth: 1,
    borderColor: '#B5651D',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  filterButtonActive: { backgroundColor: '#B5651D' },
  filterButtonText: { color: '#B5651D', fontSize: 13, fontWeight: '600' },
  filterButtonTextActive: { color: '#fff' },
  clearButton: { marginTop: 12, alignItems: 'center' },
  clearButtonText: { color: '#888', fontSize: 13, textDecorationLine: 'underline' },

  // Menu list
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#2E2E2E', paddingHorizontal: 16 },
  emptyText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: 10, paddingHorizontal: 16 },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 16,
    elevation: 1,
  },
  menuItemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  dishName: { fontSize: 16, fontWeight: 'bold', color: '#2E2E2E' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#B5651D' },
  course: { fontSize: 13, color: '#777', marginTop: 2, marginBottom: 4 },
  description: { fontSize: 14, color: '#444' },
  cardButtonRow: { flexDirection: 'row', marginTop: 10, gap: 10 },
  editButton: {
    flex: 1,
    backgroundColor: '#E8DDCF',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: { color: '#B5651D', fontWeight: 'bold' },
  deleteButton: {
    flex: 1,
    backgroundColor: '#F8D7DA',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: { color: '#A33A3A', fontWeight: 'bold' },

  // Edit modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
  },
});