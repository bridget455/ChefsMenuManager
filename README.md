Christoffel's Menu Manager
Description
Christoffel's Menu Manager is  React Native application that allows chefs that work at that restaurant to easily manage menu items by adding or removing them.
This mobile application provides a form where the user can enter a dish name, description, course, and price.
When saved, it displays a list below the form.

Features 
- Add new menu items 
- Enter a dish name and description
- Select a course 
 *Starter
 *Main course 
 *Dessert
- Enter price using ZAR (South African Rands{R}) 
- Validate required information before you save
- Validate if price is greater than 0
- Display number of menu items 
- Display saved menu items with their name, course, description, and price
- Clear the form after successfully adding an item
- Show success and error alerts

Technologies Used

- React Native
- JavaScript
- React Hooks ("useState")
- "@react-native-picker/picker"
- Git
- GitHub

How It Works

The application uses React Native components to create the mobile interface.

The "useState" hook is used to store the information entered by the user, including:

- "dishName" – stores the name of the dish
- "description" – stores the dish description
- "course" – stores the selected course
- "price" – stores the price
- "menuItems" – stores all the menu items added by the user

When the Save Menu Item button is pressed, the "handleAddItem" function checks that all required fields have been completed.

The application also checks that the price is a valid number greater than zero. If the information is valid, a new menu item is created and added to the menu list.

The "FlatList" component is then used to display the saved menu items.

Validation

The application includes validation to prevent incomplete or incorrect information from being saved.

If a required field is empty, the application displays a Missing Information alert.

If the price is not a valid positive number, the application displays an Invalid Price alert.

After a menu item is successfully saved, the application displays a success message and clears the form.

Project Structure

The main application code is contained in the "App.js" file.

The application uses React Native components such as:

- "SafeAreaView"
- "View"
- "Text"
- "TextInput"
- "TouchableOpacity"
- "FlatList"
- "Alert"
- "Picker"

"StyleSheet" is used to control the appearance and layout of the application.

Version Control

Git was used to track the project and GitHub was used to store the repository online.

The project has been pushed to the "main" branch of the GitHub repository.

Author

Created by Christoffel.
