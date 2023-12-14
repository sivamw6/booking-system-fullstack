import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';

import { GET_TIMETABLES } from '../../graphQL/queries/queries';
import { UPDATE_TIMETABLE, DELETE_TIMETABLE } from '../../graphQL/mutations/mutations';
import Card from '../../components/common/Card';


function EditTimetables({user}) {

  const { control, getValues, handleSubmit, setValue } = useForm();
  const { loading, error, data, refetch } = useQuery(GET_TIMETABLES);
  const [updateTimetable] = useMutation(UPDATE_TIMETABLE);
  const [deleteTimetable] = useMutation(DELETE_TIMETABLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  const token = user.token;

  const handleUpdate = async (timetableId) => {
    const updatedData = {
      title: getValues(`title-${timetableId}`),
      day: getValues(`day-${timetableId}`),
      time: Number(getValues(`time-${timetableId}`)),
      trainer: getValues(`trainer-${timetableId}`),
      capacity: Number(getValues(`capacity-${timetableId}`)),
    };

    try {
      const response = await updateTimetable({
        variables: {
          id: timetableId,
          input: updatedData,
        },
        context: {
          headers: {
            authorization: `${token}`, 
          },
        },
      });
      if (response.data) {
        console.log("Timetable updated successfully:", response.data);
      }
    } catch (error) {
      console.log(updatedData)
      console.error("Error updating timetable:", error.message);
    }
    }
  
  const handleDelete = async (timetableId) => {
    try {
      const response = await deleteTimetable({
        variables: {
          id: timetableId,
        },
        context: {
          headers: {
            authorization: `${token}`, 
          },
        },
      });
      
      if (response.data) {
        console.log("Timetable deleted successfully:", response.data);
      }
      setValue(`username-${timetableId}`, ""); 
      setValue(`email-${timetableId}`, ""); 

      await refetch();
    } catch (error) {
      console.error("Error deleting timetable:", error.message);
    }
  }

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
      <Card title={<><Link className="a" to="/add-class">Add Class / </Link>Edit Timetables</>}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Day</th>
                <th>Time</th>
                <th>Trainer</th>
                <th>Capacity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.timetables.map((timetable) => (
                <tr key={timetable.id}>
                  <td>
                    <Controller
                      name={`title-${timetable.id}`}
                      control={control}
                      defaultValue={timetable.title}
                      render={({ field }) => <input {...field} />}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`day-${timetable.id}`}
                      control={control}
                      defaultValue={timetable.day}
                      render={({ field }) => <input {...field} />}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`time-${timetable.id}`}
                      control={control}
                      defaultValue={timetable.time}
                      render={({ field }) => <input {...field} />}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`trainer-${timetable.id}`}
                      control={control}
                      defaultValue={timetable.trainer}
                      render={({ field }) => <input {...field} />}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`capacity-${timetable.id}`}
                      control={control}
                      defaultValue={timetable.capacity}
                      render={({ field }) => <input {...field} />}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={()=> handleUpdate(timetable.id)}>✓</button>
                    <button type="button" onClick={()=> handleDelete(timetable.id)}>✗</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </Card>
  )
}

export default EditTimetables