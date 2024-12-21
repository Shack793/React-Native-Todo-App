# Todo App

A React Native mobile application for managing todos with CRUD operations.

## Features

- View list of todos
- Add new todos
- Update todo status
- Delete todos
- Filter todos by status
- Sort todos by creation date

## Technologies Used

- React Native
- Expo
- React Navigation
- Axios for API calls
- @react-native-picker/picker for status selection

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
expo start
```

3. Scan the QR code with Expo Go app on your mobile device

## API Endpoints

The app uses the following API endpoints:

- GET `/api/todos` - Fetch all todos
- POST `/api/todos` - Create a new todo
- PUT `/api/todos/{id}` - Update a todo
- DELETE `/api/todos/{id}` - Delete a todo

## Project Structure

- `/src/screens/` - Screen components
  - `TodoListScreen.js` - Main screen with todo list
  - `TodoScreen.js` - Add todo form screen
- `/src/navigation/` - Navigation configuration
- `/assets/` - App assets (icons, splash screen)
