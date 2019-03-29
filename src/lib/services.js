import jsonToFormData from './json-form-data';
import httpClient from './http-client';
const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export function serializeEnrollment(enrollment) {
  return jsonToFormData({ enrollment });
}

export function updateEnrollmentContacts({ enrollment }) {
  const serializedEnrollment = serializeEnrollment(enrollment);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  return httpClient
    .patch(
      `${BACK_HOST}/api/enrollments/${enrollment.id}/update_contacts`,
      serializedEnrollment,
      config
    )
    .then(({ data }) => data);
}

export function createOrUpdateEnrollment({ enrollment }) {
  const serializedEnrollment = serializeEnrollment(enrollment);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (enrollment.id) {
    return httpClient
      .patch(
        `${BACK_HOST}/api/enrollments/${enrollment.id}`,
        serializedEnrollment,
        config
      )
      .then(({ data }) => data);
  }

  return httpClient
    .post(`${BACK_HOST}/api/enrollments/`, serializedEnrollment, config)
    .then(({ data }) => data);
}

export function getUserEnrollment(id) {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export function getUserValidatedFranceconnectEnrollments() {
  // TODO create a route that returns only the validated FC enrollments
  return httpClient
    .get(
      `${BACK_HOST}/api/enrollments/?state=validated&fournisseur_de_donnees=franceconnect`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then(({ data }) => data);
}

export function getPublicValidatedEnrollments(fournisseurDeDonnees) {
  const filterParams = fournisseurDeDonnees
    ? `?fournisseur_de_donnees=${fournisseurDeDonnees}`
    : '';

  return httpClient
    .get(`${BACK_HOST}/api/enrollments/public${filterParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export function getUserPendingEnrollments() {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export function getUserArchivedEnrollments() {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/?archived=true`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export function triggerEnrollment({ action, id, comment }) {
  const options = {
    event: action,
  };

  if (comment) {
    options.comment = comment;
  }

  return httpClient.patch(
    `${BACK_HOST}/api/enrollments/${id}/trigger`,
    options,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function getResourceProviderService() {
  return httpClient
    .get(`${BACK_HOST}/api/resource_providers`)
    .then(response => response.data);
}

export function getSiretInformation(siret) {
  return httpClient
    .get(`https://sirene.entreprise.api.gouv.fr/v1/siret/${siret}`)
    .then(
      ({
        data: {
          etablissement: {
            enseigne,
            nom_raison_sociale,
            activite_principale,
            l2_normalisee,
            l3_normalisee,
            l4_normalisee,
            l5_normalisee,
            l6_normalisee,
            l7_normalisee,
          },
        },
      }) => {
        const adresse = [
          l2_normalisee,
          l3_normalisee,
          l4_normalisee,
          l5_normalisee,
          l6_normalisee,
          l7_normalisee,
        ]
          .filter(e => e)
          .join(', ');

        return {
          enseigne,
          nom_raison_sociale,
          activite_principale,
          adresse,
        };
      }
    );
}
