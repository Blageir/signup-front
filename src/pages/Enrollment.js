import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../components/icons/spinner';
import { getUserEnrollment } from '../lib/services';
import { Redirect } from 'react-router-dom';

const Enrollment = ({
  match: {
    params: { enrollmentId },
  },
}) => {
  const [fetchEnrollmentError, setFetchEnrollmentError] = useState(false);
  const [fetchEnrollmentNotFound, setFetchEnrollmentNotFound] = useState(false);
  const [targetApi, settargetApi] = useState(null);

  const fetchEnrollment = async ({ enrollmentId }) => {
    try {
      setFetchEnrollmentError(false);
      setFetchEnrollmentNotFound(false);
      const { target_api } = await getUserEnrollment(enrollmentId);

      settargetApi(target_api);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setFetchEnrollmentNotFound(true);
      } else {
        setFetchEnrollmentError(true);
      }
    }
  };

  useEffect(() => {
    if (enrollmentId) {
      fetchEnrollment({ enrollmentId });
    }
  }, [enrollmentId]);

  if (enrollmentId && targetApi) {
    return (
      <Redirect
        to={{
          pathname: `/${targetApi.replace(/_/g, '-')}/${enrollmentId}`,
        }}
      />
    );
  }

  if (fetchEnrollmentNotFound) {
    return (
      <section className="section-grey section-full-page">
        <div className="notification error">
          Nous n'avons pas trouvé votre demande d'habilitation.
        </div>
      </section>
    );
  }

  if (fetchEnrollmentError) {
    return (
      <section className="section-grey section-full-page">
        <div className="notification error">
          Erreur inconnue lors de la récupération de la demande d'habilitation.
        </div>
      </section>
    );
  }

  return (
    <section className="section-grey section-full-page">
      <Spinner />
    </section>
  );
};

Enrollment.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

Enrollment.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default Enrollment;
