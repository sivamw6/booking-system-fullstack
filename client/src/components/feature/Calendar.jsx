import { Link } from 'react-router-dom';
import styles from './Calendar.module.css';

function Calendar({ data, currentDate, setCurrentDate }) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysNames = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const currentMonthWYear = `${monthNames[currentDate.getMonth()]}${currentDate.getFullYear()}`


    const totalUsedCells = daysInMonth + adjustedFirstDay;

    const postPlaceholders = 7 - (totalUsedCells % 7);
    const totalPostPlaceholders = postPlaceholders === 7 ? 0 : postPlaceholders;

    const shouldDisablePrevious = () => {
      const now = new Date();
      return currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() <= now.getMonth();
  };

    const handlePreviousMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    const getDayName = (dayNumber) => {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
      const jsDayIndex = date.getDay(); // Sunday is 0, Monday is 1, etc.
      if (jsDayIndex === 0) return "Sun";
      if (jsDayIndex === 1) return "Mon";
      if (jsDayIndex === 2) return "Tue";
      if (jsDayIndex === 3) return "Wed";
      if (jsDayIndex === 4) return "Thurs";
      if (jsDayIndex === 5) return "Fri";
      if (jsDayIndex === 6) return "Sat";
    };
    const getCourseForDay = (dayNumber) => {
        const dayName = getDayName(dayNumber);
        return coursesByDay[dayName];
    };

    const coursesByDay = data.timetables.reduce((acc, course) => {
      if (!acc[course.day]) {
            acc[course.day] = [];
          }
          acc[course.day].push({
            title: course.title,
            time: course.time,
            id: course.id
          });
          return acc;
    }, {});




    return (
      <div>
        <div className={styles.calendarHeader}>
          <button className={styles.button} disabled={shouldDisablePrevious()} onClick={handlePreviousMonth}>&lt;</button>
          <span>{currentMonthWYear}</span>
          <button className={styles.button} onClick={handleNextMonth}>&gt;</button>
        </div>
        <div className={styles.daysNames}>
          {daysNames.map(day => (
              <div key={day} className={styles.dayName}>{day}</div>
          ))}
        </div>
        <div className={styles.daysContainer}>
          {Array.from({ length: adjustedFirstDay }).map((_, index) => (
              <div key={`pre-placeholder-${index}`} className={styles.dayPlaceholder}></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const coursesForDay = getCourseForDay(day);

              return (
                  <div key={index} className={styles.day}>
                      <div className='text-end text-muted' >{day}</div>
                      {coursesForDay && coursesForDay.map((course, courseIndex) => (
                        <Link 
                            key={`${day}-${courseIndex}-${course.title}`} 
                            to={`/class-detail/${day}${currentMonthWYear}/${course.title}/${course.id}`}
                            className={styles.courseName}>
                                ({course.time}pm) {course.title}
                        </Link>
                      ))}
                  </div>
              );
          })}
          {Array.from({ length: totalPostPlaceholders }).map((_, index) => (
              <div key={`post-placeholder-${index}`} className={styles.dayPlaceholder}></div>
          ))}
        </div>
      </div>
  );
  }

export default Calendar;
