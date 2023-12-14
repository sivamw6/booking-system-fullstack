// External
import { useState } from "react";
import { Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
//Apollo Client
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../graphQL/mutations/mutations";


// Local
import styles from './Signup.module.css';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

function Signup({onLogin}) {

  //JOI Validation for React-Hook-Forms
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string().min(6).required(),
  });


  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

    //?Apollo Client Mutation
    const [createUser, { loading, error }] = useMutation(CREATE_USER); //createUser - The mutation function 
    const [errorMessage, setErrorMessage] = useState(""); // Error message state
    const navigate = useNavigate(); // Navigate function to navigate to a different page
  
    //?Submit New User
    //This function is called when the form is submitted by react hook forms
    const onSubmit = async (data, event) => {
      event.preventDefault(); // Prevents page from refreshing on submit
      const { username, email, password } = data; // Destructure data from form
  
      try {
        // Send the mutation request with data as input
        const result = await createUser({
          variables: {
            input: {
              username,
              email,
              password,
            },
          },
        });
        console.log(result.data); //Response from the server
        onLogin(result.data.createUser); // Call onLogin function with the user to be save to state and session storage
        navigate("/"); // Navigate to the home page
      } catch (error) {
        console.log(error.message);
        setErrorMessage(error.message); // Set error message state
      }
    };


  return (
    <div className={styles.signupPage}>
      <Card title={<><Link className={styles.a} to="/login">Login / </Link>Sign Up</>}>
        <Form noValidate="noValidate" onSubmit={handleSubmit(onSubmit)}className='mt-4'>
          {/* User data */}
          {/* Userrname */}
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Form.Group className="mb-4" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  {...field}
                  type="text"
                  className={styles.input} 
                  name="username" 
                />
                {errors.username && (
                  <Alert variant="danger" className="mb-2 alert-dark mb-0">
                    {errors.username.message}
                  </Alert>
                )}
              </Form.Group>
            )}
          />
          {/* Email */}
          <Controller 
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  {...field}
                  className={styles.input} 
                  type="email"/>
                {errors.email && (
                  <Alert variant="danger" className="mt-2 alert-dark mb-0">
                    {errors.email.message}
                  </Alert>
                )}
              </Form.Group>
            )}
          />


          {/* Password */}
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
                />
                {errors.password && (
                  <Alert variant="danger" className="mt-2 alert-dark mb-0">
                    {errors.password.message}
                  </Alert>
                )}
            </Form.Group>
            )}
          />
          {/* General Error Messages */}
          {errorMessage && (
            <Alert variant="danger" className="mt-2 alert-dark mb-0">
              {errorMessage}
            </Alert>
          )}
          {/* Submit button */}
          <Button 
            className={styles.button} 
            type="submit">{loading ? "..." : "Sign Up"}
          </Button>
        </Form>
        <div className={styles.span}>
          <span>Already a member?&nbsp;<Link className={styles.a} to="/login">Login here</Link></span>
        </div>
      </Card>

    </div>
  )
}

export default Signup 