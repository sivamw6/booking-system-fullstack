import { Link, useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form"; 
// Joi Validation
import Joi from "joi";
// Joi Resolver for React Hook Forms
import { joiResolver } from "@hookform/resolvers/joi"; 
//Apollo Client
import { useMutation } from "@apollo/client";
//GraphQL Mutations
import { LOGIN_USER } from "../../graphQL/mutations/mutations";


import styles from './Login.module.css';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

function Login({onLogin}) {
  // JOI Validation for React-Hook-Forms
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string().min(6).required(),
  });

  // React-Hook-Forms
  // control - React Hook Forms Controller this is used to control the input
  // handleSubmit - React Hook Forms handleSubmit function this is used to handle the submit event
  // formState - React Hook Forms formState this is used to access the form state
  // reset - React Hook Forms reset function this is used to reset the form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER); // loginUser - The mutation function
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const navigate = useNavigate(); // Navigate function to navigate to a different page

  // Submit Login
  const onSubmit = async (data, event) => {
    event.preventDefault(); // Prevents page from refreshing on submit
    const { email, password } = data; // Destructure data from form
    try {
      // Send the mutation request with data as input
      const result = await loginUser({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
      console.log(result.data);
      onLogin(result.data.loginUser); // Call onLogin function from App.jsx to store the user in App.jsx state
      navigate("/"); // Navigate to the home page
    } catch (error) {
      console.log(error);
      console.log(error.message);
      setErrorMessage(error.message); // Set error message state
      reset(); // Reset the form
    }
  };



  return (
    <div className={styles.loginPage}>
      <Card title={<>Login<Link className={styles.a} to="/signup"> / Sign Up</Link></>} >
      {/* <i className="bi bi-calendar-event"></i>{" "}
              {new Date().toLocaleDateString()} */}
        <Form noValidate="noValidate" onSubmit={handleSubmit(onSubmit)} className='mt-4'>

        <Controller 
          name="email"
          control={control}
          render={({ field }) =>(

            <Form.Group className="mb-4" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                {...field}
                type="email"
                size="lg"
                className={styles.input}
              />
                {errors.email && (
                  <Alert variant="danger" className="mt-2 alert-dark mb-0">
                    {errors.email.message}
                  </Alert>
                )}
            </Form.Group>
          )}       
        />

        <Controller 
            name="password"
            control={control}
            render={({ field }) => (              
              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  {...field}
                  className={styles.input}
                  type="password"
                  size="lg"
                />
                  {errors.password && (
                    <Alert variant="danger" className="mt-2 alert-dark mb-0">
                      {errors.password.message}
                    </Alert>
                  )}
                </Form.Group>
            )}        
        />

          {errorMessage && (
            <Alert variant="danger" className="mt-2 alert-dark mb-0">
              {errorMessage}
            </Alert>
          )}
    
          <Button type="submit">{loading ? "..." : "Log in"}</Button>
        </Form>
        <div className={styles.span}>
          <span>Not a member?&nbsp;<Link className={styles.a} to="/signup">Sign up here</Link></span>
        </div>
      </Card>
    </div>
  )
}

export default Login;
