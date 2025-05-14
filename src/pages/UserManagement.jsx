import { useState, useEffect } from 'react';
import { useGetUsersQuery, useCreateUserMutation, usePromoteUserMutation, useDeleteUserMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const UserManagement = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [promoteUser] = usePromoteUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  
  const { userInfo } = useSelector((state) => state.auth);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ name, email, password, role }).unwrap();
      toast.success('User created successfully');
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handlePromote = async (userId) => {
    if (window.confirm('Are you sure you want to promote this user to admin?')) {
      try {
        await promoteUser(userId).unwrap();
        toast.success('User promoted to admin');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>User Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn"
        >
          {showForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-success"
            >
              Create User
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="loading-message">Loading users...</div>
      ) : error ? (
        <div className="error-message">Error: {error.message}</div>
      ) : (
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="actions">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handlePromote(user._id)}
                        className="btn btn-outline"
                      >
                        Promote to Admin
                      </button>
                    )}
                    {user._id !== userInfo?._id && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;