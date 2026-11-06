# Christoffel's Menu Manager

**MAST5112 PoE: Final Part (Part 3)**
Thokozile Bridget Ndaba | ST10512244

A React Native (Expo) mobile app that lets a restaurant chef manage the menu: add, edit, delete, search, filter and view statistics for menu items.

## How to run

1. Install dependencies: `npm install`
2. Start the app: `npx expo start`
3. Scan the QR code with the Expo Go app on an Android phone (same Wi-Fi as the computer). If that fails, use `npx expo start --tunnel`.

## Features

- Add a menu item (dish name, description, course, price) with validation
- Edit an existing menu item and update its details
- Delete a menu item (with a confirmation prompt)
- Search menu items by dish name
- Filter menu items by course (Starter, Main Course, Dessert) and clear the filter
- Menu statistics: total number of items, average price, and number of items per course

## Change log (changes since Part 2)

### New features
- Added **Edit** button on each dish: opens a pop-up form pre-filled with the dish's details; saved changes show in the list immediately.
- Added **Delete** button on each dish: asks for confirmation before removing the item.
- Added a **search box** that filters the list by dish name as the user types.
- Added **course filter buttons** (All, Starter, Main Course, Dessert) and a "Clear Search & Filter" option. Search and filter work together.
- Added a **statistics panel** showing total items, average price and items per course. It updates automatically when items are added, edited or deleted.

### Refactoring
- Created reusable components: `LabelledInput`, `MenuItemCard` and `MenuStatistics`, so the same code is not repeated.
- Created a single `COURSES` list used by the form, the filter buttons and the statistics, instead of typing the course names in several places.
- Created one shared `validateFields` function used by both the Add and Edit forms.
- Used clearer variable and function names and added comments explaining each section.

### User experience improvements
- The whole screen is scrollable so all sections fit on smaller phones.
- Success and error messages for adding, editing, deleting and invalid input.
- Messages when the menu is empty or when no items match the search or filter.
- The item count shows how many items match the filter (e.g. "Menu Items (2 of 5)").
- Consistent colours, buttons and layout across the screen and the edit pop-up.
- Title changed to "Christoffel's Menu Manager" to match the Part 1 scenario.

## Technologies

- React Native with Expo
- `@react-native-picker/picker` for the course dropdown