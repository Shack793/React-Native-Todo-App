import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'https://system.homefield.fun';

const STATUS_OPTIONS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

export default function TodoScreen({ navigation }) {
  const [newTodo, setNewTodo] = useState({
    title: '',
    details: '',
    status: STATUS_OPTIONS.NOT_STARTED
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTodo = async () => {
    if (!newTodo.title.trim()) {
      alert('Please fill in the title');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Adding new todo:', newTodo);
      await axios.post('/api/todos', newTodo);
      setNewTodo({ 
        title: '', 
        details: '', 
        status: STATUS_OPTIONS.NOT_STARTED 
      });
      navigation.navigate('TodoList');
    } catch (error) {
      console.error('Error adding todo:', error.response || error);
      setError('Failed to add todo. Please check your API connection.');
      alert('Error adding todo. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Add New Todo</Text>
        <TextInput
          style={styles.input}
          placeholder="Todo Title"
          value={newTodo.title}
          onChangeText={(text) => setNewTodo({ ...newTodo, title: text })}
        />
        <TextInput
          style={[styles.input, styles.detailsInput]}
          placeholder="Todo Details (optional)"
          value={newTodo.details}
          onChangeText={(text) => setNewTodo({ ...newTodo, details: text })}
          multiline
        />
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status: </Text>
          <Picker
            selectedValue={newTodo.status}
            style={styles.statusPicker}
            onValueChange={(value) => setNewTodo({ ...newTodo, status: value })}
          >
            <Picker.Item label="Not Started" value={STATUS_OPTIONS.NOT_STARTED} />
            <Picker.Item label="In Progress" value={STATUS_OPTIONS.IN_PROGRESS} />
            <Picker.Item label="Completed" value={STATUS_OPTIONS.COMPLETED} />
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={addTodo}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>Add Todo</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  detailsInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  statusLabel: {
    paddingLeft: 15,
    fontSize: 16,
  },
  statusPicker: {
    flex: 1,
    height: 50,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
});
