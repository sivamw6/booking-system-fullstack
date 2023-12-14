/**
 * EditMembers Component
 * 
 * Purpose:
 * - This file is responsible for displaying all user data.
 * - Users authenticated with `isAdmin=true` can update and delete user information.
 * 
 * Key Features:
 * 1. Fetch all user data and display it in a table.
 * 2. Provide functionality for updating and deleting users.
 */

// import from external libraries
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/client';
// import from local
import { GET_USERS } from '../../graphQL/queries/queries';
import { UPDATE_USER, DELETE_USER } from '../../graphQL/mutations/mutations';


function EditMembers({user}) {
  // Global Variables
  // React Hook Form utilities
  const { control,getValues, handleSubmit, setValue } = useForm();
  // Fetch all users using Apollo Client's useQuery
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [updateUser] = useMutation(UPDATE_USER); // Mutation to update user
  const [deleteUser] = useMutation(DELETE_USER); // Mutation to delete user

  // Handling loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Token for authentication
  const token = user.token;

    /**
   * Format the timestamp into a readable date
   * @param {string} timestamp - The date to be formatted.
   * @return {string} - Formatted date.
   */
  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

    /**
   * Handle the update of a user's data
   * @param {string} userId - The ID of the user to be updated.
   */
  const handleUpdate = async (userId) => {
    const updatedData = {
      // Gather updated data from form fields
      username: getValues(`username-${userId}`),
      email: getValues(`email-${userId}`),
      isAdmin: Boolean(getValues(`isAdmin-${userId}`)),
    };
  
    try {
      const response = await updateUser({
        variables: {
          id: userId,
          input: updatedData,
        },
        context: {
          headers: {
            authorization: `${token}`, 
          },
        },
      });
  
      if (response.data) {
        console.log("User updated successfully:", response.data);
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

    /**
   * Handle the deletion of a user
   * @param {string} userId - The ID of the user to be deleted.
   */
  const handleDelete = async (userId) => {
    try {
      const response = await deleteUser({
        variables: {
          id: userId,
        },
        context: {
          headers: {
            authorization: `${token}`,
          },
        },
      });
      if (response.data) {
        console.log("User deleted successfully:", response.data);
        setValue(`username-${userId}`, "");
        setValue(`email-${userId}`, "");
        await refetch();
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };  
  
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {data.getUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <Controller
                    control={control}
                    name={`username-${user.id}`}
                    defaultValue={user.username}
                    render={({ field }) => <input {...field} />}
                  />
                </td>
                <td>
                  <Controller
                    control={control}
                    name={`email-${user.id}`}
                    defaultValue={user.email}
                    render={({ field }) => <input {...field} />}
                  />
                </td>
                <td>
                  <Controller
                    control={control}
                    name={`isAdmin-${user.id}`}
                    defaultValue={user.isAdmin}
                    render={({ field }) => (
                      <select {...field}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>
                    )}
                  />
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{user.updatedAt ? formatDate(user.updatedAt) : ''}</td>
                <td>
                  <button type="button" onClick={() => handleUpdate(user.id)}>✓</button>
                  <button type="button" onClick={() => handleDelete(user.id)}>✗</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default EditMembers;