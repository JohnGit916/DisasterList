import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchWithToken } from '../utils/api';

function ReportIncident() {
  const navigate = useNavigate();

  const initialValues = {
    title: '',
    description: '',
    location: ''
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, 'Title must be at least 5 characters')
      .required('Title is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required'),
    location: Yup.string()
      .matches(/^[a-zA-Z0-9\s,.-]+$/, 'Only letters, numbers, and ,.- are allowed')
      .required('Location is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const res = await fetchWithToken('/incidents', 'POST', values);
    if (res.id) navigate(`/incident/${res.id}`);
    else alert(res.error || 'Failed to submit incident');
    setSubmitting(false);
  };

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ minWidth: '400px' }}>
        <h2 className="text-center mb-4">Report New Incident</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <Field name="title" type="text" className="form-control" placeholder="Title" />
                <ErrorMessage name="title" component="div" className="text-danger small" />
              </div>

              <div className="mb-3">
                <Field name="description" as="textarea" className="form-control" placeholder="Description" rows="4" />
                <ErrorMessage name="description" component="div" className="text-danger small" />
              </div>

              <div className="mb-3">
                <Field name="location" type="text" className="form-control" placeholder="Location" />
                <ErrorMessage name="location" component="div" className="text-danger small" />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                Submit Incident
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ReportIncident;
