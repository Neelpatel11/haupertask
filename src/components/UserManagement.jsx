import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {
  fetchUsers,
  fetchDeletedUsers,
  addUser,
  updateUser,
  deleteUser,
  restoreUser,
} from '../features/userSlice';
import './UserManagement.css';

const UserManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const deletedUsers = useSelector((state) => state.user.deletedUsers);
  const [newUser, setNewUser] = useState({ name: '', email: '', mobile: '' });
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserData, setEditableUserData] = useState({ name: '', email: '', mobile: '' });
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDeletedUsers());
  }, [dispatch]);

  const handleAddUser = () => {
    dispatch(addUser(newUser)).then((response) => {
      if (response.error) {
        console.log(response)
        toast.error("Email already exists");
      } else {
        dispatch(fetchUsers());
        setNewUser({ name: '', email: '', mobile: '' });
        toast.success("User created successfully", {
          autoClose: 1000,
        });
      }
    });
  };

  const handleEditUser = (user) => {
    setEditableUserId(user._id);
    setEditableUserData({ name: user.name, email: user.email, mobile: user.mobile });
  };

  const handleUpdateUser = () => {
    dispatch(updateUser({ id: editableUserId, user: editableUserData })).then((response) => {
      if (response.error) {
        toast.error(response.error.message , {
          autoClose: 1000,
        });
      } else {
        dispatch(fetchUsers());
        setEditableUserId(null);
        setEditableUserData({ name: '', email: '', mobile: '' });
        toast.success('User updated successfully' ,{
          autoClose: 1000,
        });
      }
    });
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id)).then(() => {
      dispatch(fetchUsers());
      dispatch(fetchDeletedUsers());
      toast.success('User deleted successfully' , {
        autoClose: 1000,
      });
    });
  };

  const handleRestoreUser = (id) => {
    dispatch(restoreUser(id)).then(() => {
      dispatch(fetchUsers());
      dispatch(fetchDeletedUsers());
      toast.success('User restored successfully' , {
        autoClose: 1000,
      });
    });
  };

  return (
    <div className="user-management">
      <div className="tabs">
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          User
        </button>
        <button className={activeTab === 'deleted' ? 'active' : ''} onClick={() => setActiveTab('deleted')}>
          Delete User
        </button>
      </div>

      <div className="add-user">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Mobile"
          value={newUser.mobile}
          onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
          required
        />
        <button onClick={handleAddUser} className="add-user-button">Add New User</button>
      </div>

      {activeTab === 'users' && (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                {editableUserId === user._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editableUserData.name}
                        onChange={(e) =>
                          setEditableUserData({ ...editableUserData, name: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={editableUserData.email}
                        onChange={(e) =>
                          setEditableUserData({ ...editableUserData, email: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editableUserData.mobile}
                        onChange={(e) =>
                          setEditableUserData({ ...editableUserData, mobile: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <button onClick={handleUpdateUser} className="save-button">Save</button>
                      <button onClick={() => setEditableUserId(null)} className="cancel-button">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>
                      <button onClick={() => handleEditUser(user)} className="edit-button">Edit</button>
                      <button onClick={() => handleDeleteUser(user._id)} className="delete-button">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'deleted' && (
        <>
          <h3>Deleted Users</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deletedUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <button onClick={() => handleRestoreUser(user._id)} className="restore-button">Restore</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserManagement;
