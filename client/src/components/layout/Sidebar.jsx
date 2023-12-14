import { Link } from "react-router-dom";

import Button from '../common/Button.jsx';
import styles from './Sidebar.module.css';

function Sidebar({ onLogout}) {

    const userInfoString = sessionStorage.getItem('user');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : {};

    const isAdmin = userInfo.isAdmin;

    return (
<div className={styles.sidebar}>
    <ul className={styles.sidebarList}>
        <li>
            <Link to="/" className={styles.sidebarItem}>
                Make a Booking
            </Link>
        </li>
        <li>
            <Link to="my-bookings" className={styles.sidebarItem}>
                My Bookings
            </Link>
        </li>
        <li>
            <Link to="my-profile" className={styles.sidebarItem}>
                My Profile
            </Link>
        </li>
        {isAdmin && (
            <li>
                <ul className={styles.sidebarList}>
                    <li>
                        <Link to="edit-timetables" className={styles.sidebarItem}>Edit Timetables</Link>
                    </li>
                    <li>
                        <Link to="edit-members" className={styles.sidebarItem}>Edit Members</Link>
                    </li>
                </ul>
            </li>
        )}
    </ul>
    <div className={styles.button} >
        <Button onClick={onLogout}>Logout</Button>
    </div>
</div>
    );
}

export default Sidebar;