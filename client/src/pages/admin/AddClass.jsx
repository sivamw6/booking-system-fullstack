import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_TIMETABLE } from '../../graphQL/mutations/mutations'; 

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

function AddClass(props) {
  const { control, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const token = props.user.token;

  const [createTimetable] = useMutation(CREATE_TIMETABLE)


  const onSubmit = async (formData) => {
    try {
      // Parse integers
      formData.time = parseInt(formData.time);
      formData.capacity = parseInt(formData.capacity);

      const { title, day, time, trainer, capacity } = formData;
    
      // Call the createTimetable mutation
      const response = await createTimetable({
        variables: {
          input: {
            title,
            day,
            time,
            trainer,
            capacity,
          },
        },
        context: {
          headers: {
            authorization: `${token}`, 
          },
        },
      })
    
      // If the mutation is successful, the response object should have the data you need
      console.log('Class added successfully', response.data );
    
      // Reset form and possibly navigate
      reset();
      navigate('/edit-timetables');
    } catch (error) {
      console.log(formData);
      if (error.networkError) {
        console.log('Network error', error.networkError);
        // 如果是网络错误，这里可以获取更多信息
      }
    
      if (error.graphQLErrors) {
        console.error('GraphQL errors', error.graphQLErrors);
        // 如果服务器返回了 GraphQL 错误，您可以在这里详细了解
      }
      console.error('Error adding class:', error);
      console.log(error.message);
    }
    
  };
  
  const daysNames = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];



  // 

  return (
    <Card title={<>Add Class<Link className="a" to="/edit-timetables"> / Edit Timetables</Link></>}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Title:</label>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} />}
          />
        </div>
        <div>
          <label>Day:</label>
          <Controller
            name="day"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <select {...field}>
                <option value="">Select a day</option>
                {daysNames.map((dayName, index) => (
                  <option key={index} value={dayName}>
                    {dayName}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        <div>
          <label>Time:</label>
          <Controller
            name="time"
            control={control}
            defaultValue={0}
            render={({ field }) => <input {...field} />}
          />
        </div>
        <div>
          <label>Trainer:</label>
          <Controller
            name="trainer"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} />}
          />
        </div>
        <div>
          <label>Capacity:</label>
          <Controller
            name="capacity"
            control={control}
            defaultValue={0}
            render={({ field }) => <input {...field} />}
          />
        </div>
        <Button type="submit">Add Class</Button>
      </form>
    </Card>
  );
}

export default AddClass;
