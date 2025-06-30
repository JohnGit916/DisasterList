import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Login() {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const res = await fetch('https://disasterlist-backend.onrender.com/login', {
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
      alert(data.error || 'Login failed');
    }

    setSubmitting(false);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ minWidth: '350px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field type="text" name="username" className="form-control mb-3" placeholder="Username" />
              <ErrorMessage name="username" component="div" className="text-danger mb-2" />

              <Field type="password" name="password" className="form-control mb-3" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="text-danger mb-2" />

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
