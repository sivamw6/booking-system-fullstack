import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER } from '../../graphQL/queries/queries';
import { UPDATE_USER } from '../../graphQL/mutations/mutations';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

function MyProfile({ user }) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userId: user.id,
    },
    context: {
      headers: {
        authorization: `${user.token}`,
      },
    },
  });

  const [updateUserData] = useMutation(UPDATE_USER);
  const { control, handleSubmit } = useForm(); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const userData = data.getUser;

  const onSubmit = async (formData) => {
    try {
      const response = await updateUserData({
        variables: {
          id: user.id,
          input: formData,
        },
        context: {
          headers: {
            authorization: `${user.token}`,
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

  return (
    <Card title="My Profile">
      <form onSubmit={handleSubmit(onSubmit)}> 
        <table>
          <tbody>
            <tr>
              <td>Username:</td>
              <td>
                <Controller
                  name="username"
                  control={control}
                  defaultValue={userData.username}
                  render={({ field }) => <input {...field} />}
                />
              </td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>
                <Controller
                  name="email"
                  control={control}
                  defaultValue={userData.email}
                  render={({ field }) => <input {...field} />}
                />
              </td>
            </tr>
            <tr>
              <td>Created At:</td>
              <td>{userData.createdAt}</td>
            </tr>
          </tbody>
        </table>
        <Button type="submit">Update</Button>
      </form>
    </Card>
  );
}

export default MyProfile;
