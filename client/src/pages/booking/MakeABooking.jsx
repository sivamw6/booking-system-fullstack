import { useState } from 'react';
import { useQuery } from '@apollo/client';

import styles from './MakeABooking.module.css';
import { GET_TIMETABLES } from '../../graphQL/queries/queries';
import Calendar from '../../components/feature/Calendar';

function MakeABooking() {
  const { loading, error, data } = useQuery(GET_TIMETABLES);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.timetables) return <p>No timetable data available</p>;
  
  
  return (
    <div className={styles.makeABookingPage}>
        <Calendar data={data} currentDate={currentDate} setCurrentDate={setCurrentDate} />
    </div>
  )
}

export default MakeABooking;
