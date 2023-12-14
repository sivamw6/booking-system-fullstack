/**
 * ClassDetail Component
 * Purpose:
 * - This file is responsible for displaying detailed information about a specific class.
 * - Data for the class is retrieved from the database and rendered for the user.
 * - Additionally, this component allows the user to make a booking for the class, 
 *   thereby creating a new record for the booked class.
 * 
 * Key Features:
 * 1. Fetch and display detailed class information.
 * 2. Provide functionality for users to book a class / create new booking data to db.
 */

// Importing necessary React hooks and utilities.
import { useState } from 'react';  
import { useParams, useNavigate } from 'react-router-dom'; 
import { useQuery, useMutation } from '@apollo/client';
import { Table } from 'react-bootstrap'; 

// Importing GraphQL queries and mutations.
import { GET_TIMETABLES } from '../../graphQL/queries/queries';
import { CREATE_BOOKEDCLASS } from '../../graphQL/mutations/mutations';

// Importing CSS module for styling.
import styles from './ClassDetail.module.css';

// Importing custom components.
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TableAnimation from '../../components/feature/TableAnimation';

function ClassDetail(props) {
  
  // React Router's navigate hook for programmatically navigating to other routes.
  const navigate = useNavigate();
  // Retrieving route parameters using React Router's useParams hook.
  const { courseName, day, timetableId } = useParams();
  
  // State variable for displaying any booking errors.
  const [bookingErrorMessage, setBookingErrorMessage] = useState('');

  // Extracting the user token from the passed in props.
  const token = props.user.token;

  // Function to get the short form day name from a given date string.
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  
  // Getting the short form of the day name.
  const dayName = getDayName(day);
  
  // Formatting the day string for better presentation.
  const formattedDate = day.replace(/(\d+)([A-Za-z]+)(\d+)/, '$1 $2 $3');

  // Apollo Client's query hook to fetch timetables from GraphQL server.
  const { loading, error, data } = useQuery(GET_TIMETABLES);
  // Apollo Client's mutation hook to create a booked class on the GraphQL server.
  const [createBookedClass] = useMutation(CREATE_BOOKEDCLASS);

  // If still loading data, show a loading message.
  if (loading) return <p>Loading...</p>;
  // If there's an error in fetching data, show the error.
  if (error) return <p>Error: {error.message}</p>;

  // Function to handle booking of a class.
  const handleBookClass = async () => {
    try {
      await createBookedClass({
        variables: {
          input: {
            timetableId: timetableId,
            userId: props.user.id,
            date: day
          },
        },
        context: {
          headers: {
            authorization: `${token}`, 
          },
        },
      });
      setBookingErrorMessage('');
      navigate('/my-bookings');
    } catch (error) {
      console.log(error)
      setBookingErrorMessage(error.message || 'Error booking class')
    }
  }

  // Find the course matching the given course name and day name.
  const matchedCourse = data.timetables.find(course => course.title === courseName && course.day === dayName);

  return (
    <div className={styles.classDetail}>
      <Card >
        <Table>
          <tbody>
            {/* Display course details in table rows. */}
            <TableAnimation delay={100}>
              <td>Course Name: </td>
              <td> {matchedCourse ? matchedCourse.title : "Not Found"}</td>
            </TableAnimation>
            <TableAnimation delay={100}>
              <td>Date: </td>
              <td>{matchedCourse ? matchedCourse.day : "Not Found"} {formattedDate}</td>
            </TableAnimation>
            <TableAnimation delay={100}>
              <td>Time: </td>
              <td>{matchedCourse ? matchedCourse.time : "Not Found"}:00 pm</td>
            </TableAnimation>
            <TableAnimation delay={100}>
              <td>Trainer: </td>
              <td>{matchedCourse ? matchedCourse.trainer : "Not Found"}</td>
            </TableAnimation>
          </tbody>
        </Table>
        <Button onClick={handleBookClass}>Book</Button>
        {bookingErrorMessage && <div className="text-center" style={{color:'red'}}>Error: {bookingErrorMessage}</div>}
      </Card>
    </div>
  )
}

export default ClassDetail;
