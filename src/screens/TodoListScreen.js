import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
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

export default function TodoListScreen({ navigation }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTodos();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchTodos();
  }, [filter, sortBy, sortOrder]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filter) params.append('status', filter);
      params.append('sort_by', sortBy);
      params.append('sort_order', sortOrder);
      
      console.log('Fetching todos with params:', params.toString());
      const response = await axios.get(`/api/todos?${params.toString()}`);
      console.log('Todos response:', response.data);
      setTodos(response.data.data || []);
    } catch (error) {
      console.error('Error fetching todos:', error.response || error);
      setError('Failed to load todos. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  const updateTodoStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating todo status:', { id, newStatus });
      await axios.put(`/api/todos/${id}`, { status: newStatus });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error.response || error);
      setError('Failed to update todo status.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting todo:', id);
      await axios.delete(`/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error.response || error);
      setError('Failed to delete todo.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <View style={styles.todoContent}>
        <Text style={styles.todoTitle}>{item.title}</Text>
        <Text style={styles.todoDetails}>{item.details}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status: </Text>
          <Picker
            selectedValue={item.status}
            style={styles.statusPicker}
            onValueChange={(value) => updateTodoStatus(item.id, value)}
          >
            <Picker.Item label="Not Started" value={STATUS_OPTIONS.NOT_STARTED} />
            <Picker.Item label="In Progress" value={STATUS_OPTIONS.IN_PROGRESS} />
            <Picker.Item label="Completed" value={STATUS_OPTIONS.COMPLETED} />
          </Picker>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={() => deleteTodo(item.id)}
      >
        <Text style={styles.buttonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTodo')}
        >
          <Text style={styles.addButtonText}>Add New Todo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Status:</Text>
        <Picker
          selectedValue={filter}
          style={styles.filterPicker}
          onValueChange={setFilter}
        >
          <Picker.Item label="All Status" value="" />
          <Picker.Item label="Not Started" value={STATUS_OPTIONS.NOT_STARTED} />
          <Picker.Item label="In Progress" value={STATUS_OPTIONS.IN_PROGRESS} />
          <Picker.Item label="Completed" value={STATUS_OPTIONS.COMPLETED} />
        </Picker>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.emptyText}>No todos found. Add your first todo!</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  filterPicker: {
    flex: 1,
    height: 50,
  },
  list: {
    flex: 1,
  },
  todoItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  todoContent: {
    flex: 1,
    marginRight: 10,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  todoDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
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
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 20,
  },
});
