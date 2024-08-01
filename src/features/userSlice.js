import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  deletedUsers: [],
  status: 'idle',
  error: null,
};

// Thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('http://localhost:5000/users');
  return response.data;
});

export const fetchDeletedUsers = createAsyncThunk('users/fetchDeletedUsers', async () => {
  const response = await axios.get('http://localhost:5000/deleted-users');
  return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (user) => {
  const response = await axios.post('http://localhost:5000/users', user);
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, user }) => {
  const response = await axios.put(`http://localhost:5000/users/${id}`, user);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await axios.delete(`http://localhost:5000/users/${id}`);
  return id;
});

export const restoreUser = createAsyncThunk('users/restoreUser', async (id) => {
  const response = await axios.put(`http://localhost:5000/restore-user/${id}`);
  return response.data;
});

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchDeletedUsers.fulfilled, (state, action) => {
        state.deletedUsers = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.deletedUsers = state.deletedUsers.filter(
          (user) => user._id !== action.payload._id
        );
        state.users.push(action.payload);
      });
  },
});

export default userSlice.reducer;
