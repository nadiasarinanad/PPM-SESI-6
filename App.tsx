import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  first_name: string;
  last_name: string; // Changed to represent cat price
  email: string; // Changed to represent a catchy description
  avatar: string;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://reqres.in/api/users?per_page=2');
      setUsers(response.data.data);
    } catch (error) {
      console.log('Fetch Error:', error);
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  // POST
  const postData = async () => {
    try {
      const newUsers = [
        {
          first_name: 'Cat Bella',
          last_name: '$200', // Price for Cat Bella
          email: 'A beautiful Siamese cat with blue eyes!', // Catchy description
          avatar: 'https://i.pinimg.com/564x/f8/ef/50/f8ef50d693b00f946c60028eb74f6f7b.jpg',
        },
        {
          first_name: 'Cat Kitty',
          last_name: '$150', // Price for Cat Kitty
          email: 'An adorable fluffy Persian cat!', // Catchy description
          avatar: 'https://i.pinimg.com/736x/57/d9/11/57d911723a19239bd3d3a1c569caaab7.jpg',
        },
        {
          first_name: 'Cat Andromeda',
          last_name: '$300', // Price for Cat Andromeda
          email: 'A majestic Maine Coon with a thick coat!', // Catchy description
          avatar: 'https://i.pinimg.com/564x/b0/12/0c/b0120cd6e0e37f012f7b35d4a2e0dc42.jpg',
        },
      ];

      const response = await axios.post('https://reqres.in/api/users', newUsers[2]);

      const usersWithID = [
        { id: response.data.id, ...newUsers[0] },
        { id: response.data.id + 1, ...newUsers[1] },
        { id: response.data.id + 2, ...newUsers[2] },
      ];

      setUsers((prevUsers) => [...prevUsers, ...usersWithID]);

      Alert.alert('Users Created', 'Users successfully added');
    } catch (error) {
      console.log('Post Error:', error);
      Alert.alert('Error', 'Failed to add users');
    }
  };

  // PUT
  const updateData = async (id: number) => {
    try {
      const updatedUser = {
        first_name: 'Cat Lovers',
        last_name: '$250', // Updated price
        email: 'The ultimate companion for cat enthusiasts!', // Updated description
        avatar: 'https://i.pinimg.com/564x/e3/8a/1e/e38a1ed84ddd8d49e4b33290750120dc.jpg',
      };

      await axios.put(`https://reqres.in/api/users/${id}`, updatedUser);

      // Update state directly without refetching
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, ...updatedUser } : user
        )
      );

      Alert.alert('User Updated', `User ID: ${id} successfully updated`);
    } catch (error) {
      console.log('Update Error:', error);
      Alert.alert('Error', `Failed to update user ID: ${id}`);
    }
  };

  // DELETE
  const deleteData = async (id: number) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);

      // Remove user from state directly
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

      Alert.alert('User Deleted', `User ID: ${id} successfully deleted`);
    } catch (error) {
      console.log('Delete Error:', error);
      Alert.alert('Error', `Failed to delete user ID: ${id}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>
          {item.first_name} {item.last_name} {/* Price displayed here */}
        </Text>
        <Text style={styles.email}>{item.email} {/* Catchy description displayed here */}</Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.updateButton} onPress={() => updateData(item.id)}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteData(item.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>API from Reqres.in - Nadia</Text>
            <TouchableOpacity style={styles.createButton} onPress={postData}>
              <Text style={styles.buttonText}>Add User</Text>
            </TouchableOpacity>
          </>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#e0f7fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#00695c',
  },
  createButton: {
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 125,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  email: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#ffa726',
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#e53935',
    padding: 8,
    borderRadius: 5,
  },
});
