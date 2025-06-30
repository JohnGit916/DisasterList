import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Signup() {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Only alphanumeric characters and underscores allowed')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/, 'Must include a letter and a number')
      .required('Password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const res = await fetch('https://disasterlist-backend.onrender.com/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      try {
        const payload = JSON.parse(atob(data.access_token.split('.')[1]));
        if (payload.username) {
          localStorage.setItem('username', payload.username);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
      navigate('/');
    } else {
      alert(data.error || 'Signup failed');
    }
    setSubmitting(false);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ minWidth: '350px' }}>
        <h2 className="text-center mb-4">Signup</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field type="text" name="username" className="form-control mb-3" placeholder="Username" />
              <ErrorMessage name="username" component="div" className="text-danger mb-2" />

              <Field type="email" name="email" className="form-control mb-3" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="text-danger mb-2" />

              <Field type="password" name="password" className="form-control mb-3" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="text-danger mb-2" />

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                Create Account
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Signup;
