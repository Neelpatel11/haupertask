import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const url = 'https://haupertaskbackend.onrender.com';   // for server
// const url = 'http://localhost:5000';   //for local database 

const initialState = {
  users: [],
  deletedUsers: [],
  status: 'idle',
  error: null,
};

// Thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(`${url}/users`);
  return response.data;
});

export const fetchDeletedUsers = createAsyncThunk('users/fetchDeletedUsers', async () => {
  const response = await axios.get(`${url}/deleted-users`);
  return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (user) => {
  const response = await axios.post(`${url}/users`, user);
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, user }) => {
  const response = await axios.put(`${url}/users/${id}`, user);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await axios.delete(`${url}/users/${id}`);
  return id;
});

export const restoreUser = createAsyncThunk('users/restoreUser', async (id) => {
  const response = await axios.put(`${url}/restore-user/${id}`);
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
