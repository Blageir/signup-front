import { mapValues, memoize } from 'lodash';
import jsonToFormData from './json-form-data';
import httpClient from './http-client';
import axios from 'axios';

import {
  collectionWithKeyToObject,
  hashToQueryParams,
  objectToCollectionWithKey,
} from './utils';
const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export function serializeEnrollment(enrollment) {
  return jsonToFormData({ enrollment });
}

export function createOrUpdateEnrollment({ enrollment }) {
  const formatedEnrollment = {
    ...enrollment,
    contacts: objectToCollectionWithKey(enrollment.contacts),
  };
  const serializedEnrollment = serializeEnrollment(formatedEnrollment);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (enrollment.id) {
    return (
      httpClient
        .patch(
          `${BACK_HOST}/api/enrollments/${enrollment.id}`,
          serializedEnrollment,
          config
        )
        // format contact to a more usable structure
        // the backend should be able to use this structure to in the future
        .then(({ data: enrollment }) => ({
          ...enrollment,
          contacts: collectionWithKeyToObject(enrollment.contacts),
        }))
    );
  }

  return (
    httpClient
      .post(`${BACK_HOST}/api/enrollments/`, serializedEnrollment, config)
      // format contact to a more usable structure
      // the backend should be able to use this structure to in the future
      .then(({ data: enrollment }) => ({
        ...enrollment,
        contacts: collectionWithKeyToObject(enrollment.contacts),
      }))
  );
}

export function getUserEnrollment(id) {
  return (
    httpClient
      .get(`${BACK_HOST}/api/enrollments/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      // format contact to a more usable structure
      // the backend should be able to use this structure to in the future
      .then(({ data: enrollment }) => ({
        ...enrollment,
        contacts: collectionWithKeyToObject(enrollment.contacts),
      }))
  );
}

export function hasAccessToEnrollment(id) {
  return getUserEnrollment(id)
    .then(() => true)
    .catch(() => false);
}

export function getUserValidatedEnrollments(targetApi) {
  // NB. if the user has more than 100 validated franceconnect enrollments, he won't be able to choose amongst them all
  // since we arbitrary limit the max size of the result to 100.
  return (
    httpClient
      .get(
        `${BACK_HOST}/api/enrollments/?status=validated&target_api=${targetApi}&detailed=true&size=100`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      // format contact to a more usable structure
      // the backend should be able to use this structure to in the future
      .then(({ data: { enrollments: data } }) =>
        data.map(e => ({
          ...e,
          contacts: collectionWithKeyToObject(e.contacts),
        }))
      )
  );
}

export function getPublicValidatedEnrollments(targetApi) {
  const queryParam = hashToQueryParams({ target_api: targetApi });

  return httpClient
    .get(`${BACK_HOST}/api/enrollments/public${queryParam}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export function getEnrollments({
  page = null,
  archived = null,
  sortBy = [],
  filter = [],
}) {
  const formatedSortBy = sortBy.map(({ id, desc }) => ({
    [id]: desc ? 'desc' : 'asc',
  }));
  const formatedFilter = filter.map(({ id, value }) => ({
    [id]: value,
  }));
  const queryParam = hashToQueryParams({
    page,
    archived,
    sortedBy: formatedSortBy,
    filter: formatedFilter,
  });

  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${queryParam}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export function getUserEnrollments() {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/user`, {
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

export function deleteEnrollment({ id }) {
  return httpClient.delete(`${BACK_HOST}/api/enrollments/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getOrganizationInformation(siret) {
  return httpClient
    .get(`https://entreprise.data.gouv.fr/api/sirene/v1/siret/${siret}`)
    .then(
      ({
        data: {
          etablissement: {
            enseigne,
            nom_raison_sociale,
            activite_principale,
            libelle_activite_principale,
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
        ]
          .filter(e => e)
          .join(', ');

        const ville = [l6_normalisee, l7_normalisee].filter(e => e).join(', ');

        return mapValues(
          {
            title: `${nom_raison_sociale}${enseigne ? ' - ' + enseigne : ''}`,
            activite: `${activite_principale} - ${libelle_activite_principale}`,
            adresse,
            ville,
          },
          v => (v ? v : 'Non renseigné')
        );
      }
    );
}

export function getMostUsedComments({ eventName, targetApi } = {}) {
  const queryParam = hashToQueryParams({
    event: eventName,
    target_api: targetApi,
  });

  return httpClient
    .get(`${BACK_HOST}/api/events/most-used-comments${queryParam}`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data }) => data.map(({ comment }) => comment));
}

export async function getAPIStats(target_api) {
  const result = await axios(
    `${BACK_HOST}/api/stats${hashToQueryParams({ target_api })}`
  );

  return result;
}

export async function getAPIAverageProcessingTimeInDays(target_api) {
  const result = await axios(
    `${BACK_HOST}/api/stats/average_processing_time_in_days${hashToQueryParams({
      target_api,
    })}`
  );

  return result;
}

export const getCachedAPIAverageProcessingTimeInDays = memoize(
  getAPIAverageProcessingTimeInDays
);

export function copyEnrollment({ id }) {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${id}/copy`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data }) => data);
}
