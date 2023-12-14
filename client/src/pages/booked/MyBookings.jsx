import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_TIMETABLES_BY_IDS, GET_BOOKED_CLASSES_BY_USERID } from '../../graphQL/queries/queries';

function MyBookings({ user }) {
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_BOOKED_CLASSES_BY_USERID, {
    variables: { userId: user.id },
  });

  const [timetableIds, setTimetableIds] = useState([]);

  useEffect(() => {
    if (userData) {
      const ids = userData.getBookedClassesByUserId.map(booking => booking.timetableId);
      setTimetableIds(ids);
    }
  }, [userData]);

  const { loading: timetableLoading, error: timetableError, data: timetableData } = useQuery(GET_TIMETABLES_BY_IDS, {
    skip: timetableIds.length === 0, 
    variables: { ids: timetableIds },
  });

  if (userLoading || timetableLoading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;
  if (timetableError) return <p>Error loading timetables: {timetableError.message}</p>;

  if (!userData || !timetableData) return <p>No data available</p>;

  return (
    <div>
      <h1>My Bookings</h1>
      <ul>
        {userData.getBookedClassesByUserId.map((booking, index) => {
          const relatedTimetable = timetableData.timetable.find(t => t.id === booking.timetableId);
          return (
            <li key={booking.id}>
              <p>Date: {booking.date}</p>
              {relatedTimetable ? (
                <div>
                  <p>Title: {relatedTimetable.title}</p>
                  <p>Instructor: {relatedTimetable.trainer}</p>
                  <p>Day: {relatedTimetable.day}</p>
                  <p>Time: {relatedTimetable.time}</p>
                </div>
              ) : (
                <p>Timetable information not available.</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MyBookings;
