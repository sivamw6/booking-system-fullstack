# Course Booking System

This Course Booking System is a comprehensive web application designed to facilitate the efficient booking and management of class schedules. It integrates a member registration and login system, a calendar display for class data, and administrative features for managing both members and class schedules.

## Features

1. **Member Registration and Login System**:

   - Secure user authentication for member access.
   - Profile management for registered members.

2. **Calendar Display**:

   - Interactive calendar showing class schedules and availability.
   - Integration with backend data to display real-time class information.

3. **Administrator Management**:

   - Admin capabilities to manage member accounts.
   - Functionality to add, delete, and modify class schedules.

4. **Member Booking Editing**:
   - Members can view and edit their current class bookings.
   - Intuitive interface for managing personal schedules.

## Technology Stack

### Front-end:

- **React**: For building a dynamic and interactive UI.
- **Bootstrap**: For responsive design and layout.
- **Apollo Client**: To interact with GraphQL server.
- **GraphQL**: For efficient data querying.
- **Joi**: For data validation.

### Back-end:

- **Node.js**: The runtime environment for JavaScript server-side execution.
- **Apollo**: Middleware for connecting with a GraphQL server.
- **MongoDB**: The NoSQL database for storing application data.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Glob**: For pattern matching and file system operations.
- **Bcrypt**: For hashing and securing passwords.

## Installation

To get this project up and running on your local machine, follow these steps:

1. **Clone the Repository**:

```
git clone https://github.com/your-username/course-booking-system.git
```

2. **Install Front-end Dependencies**:
   Navigate to the front-end directory and install dependencies:

```
cd course-booking-system/client
npm install
```

3. **Install Back-end Dependencies**:
   Navigate to the back-end directory and install dependencies:

```
cd ../server
npm install
```

4. **Run the Application**:

- Start the back-end server:
  ```
  node index.js
  ```
- Start the front-end application:
  ```
  npm run dev
  ```
