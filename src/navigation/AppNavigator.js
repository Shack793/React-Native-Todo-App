import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TodoListScreen from '../screens/TodoListScreen';
import TodoScreen from '../screens/TodoScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="TodoList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="TodoList" 
          component={TodoListScreen}
          options={{
            title: 'My Todo List',
          }}
        />
        <Stack.Screen 
          name="AddTodo" 
          component={TodoScreen}
          options={{
            title: 'Add New Todo',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
