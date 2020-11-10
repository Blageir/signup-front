import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/Form';
import Nav from '../components/Nav';
import OrganisationSection from '../components/form-sections/OrganisationSection';
import DemarcheSection from '../components/form-sections/DemarcheSection';
import DescriptionSection from '../components/form-sections/DescriptionSection';
import DonneesSection from '../components/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/form-sections/CadreJuridiqueSection';
import CguSection from '../components/form-sections/CguSection';
import DonneesPersonnellesSection from '../components/form-sections/DonneesPersonnellesSection';
import MiseEnOeuvreSection from '../components/form-sections/MiseEnOeuvreSection';

const DemarcheDescription = () => (
  <div style={{ color: 'red' }} className="notification grey">
    <p>
      Pour avoir accès à l’API Particulier, diffusant des données personnelles,
      vous devez obtenir un agrément. L’accès à cette API n’est pour l’instant
      disponible que si vous êtes&nbsp;:
    </p>
    <ul>
      <li>une administration</li>
      <li>
        une entreprise prestataire d’une administration ou ayant une délégation
        de service public
      </li>
    </ul>
    <p>
      Pour utiliser API Particulier, vous devez vous engager à traiter la bonne
      donnée par le bon agent de votre administration et informer correctement
      l’usager.
    </p>
  </div>
);

const contacts = {
  technique: {
    heading: 'Responsable technique',
    description: () => (
      <p>
        Cette personne sera contactée en cas de problème technique sur votre
        service. Le responsable technique peut être le contact technique de
        votre prestataire.
      </p>
    ),
    email: '',
    phone_number: '',
  },
};

const CadreJuridiqueDescription = () => (
  <div className="text-quote">
    <p>
      Pour pouvoir bénéficier du raccordement à l&lsquo;API Particulier, le
      cadre légal et réglementaire des fournisseurs de service doit permettre à
      la DINUM de transmettre des données personnelles à votre entité
      administrative.
    </p>
  </div>
);

const DonneesDescription = () => (
  <div style={{ color: 'red' }} className="text-quote">
    <p>
      La loi informatique et libertés définit les principes à respecter lors de
      la collecte, du traitement et de la conservation de données personnelles.
    </p>
  </div>
);

const availableScopes = [
  {
    value: 'dgfip_avis_imposition',
    label: "DGFIP - Avis d'imposition",
  },
  {
    value: 'dgfip_adresse',
    label: 'DGFIP - Adresse',
  },
  {
    value: 'cnaf_quotient_familial',
    label: 'CNAF - Quotient familial',
  },
  {
    value: 'cnaf_allocataires',
    label: 'CNAF - Allocataires',
  },
  {
    value: 'cnaf_enfants',
    label: 'CNAF - Enfants',
  },
  {
    value: 'cnaf_adresse',
    label: 'CNAF - Adresse',
  },
];

const ApiParticulier = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <div className="dashboard">
    <Nav
      navLinks={[
        { id: 'head', label: 'Formulaire', style: { fontWeight: 'bold' } },
        { id: 'organisation', label: 'Organisation' },
        { id: 'donnees', label: 'Données' },
        { id: 'description', label: 'Description' },
        { id: 'cadre-juridique', label: 'Cadre juridique' },
        { id: 'donnees-personnelles', label: 'Données personnelles' },
        { id: 'contacts-moe', label: 'Mise en œuvre' },
        { id: 'cgu', label: "Modalités d'utilisation" },
      ]}
      contactInformation={[
        {
          email: 'contact@particulier.api.gouv.fr',
          label: 'Nous contacter',
          subject: 'Contact%20via%20datapass.api.gouv.fr',
        },
      ]}
    />
    <div className="main">
      <Form
        enrollmentId={enrollmentId}
        target_api="nhube"
        title="Demande d'abonnement à une démarche en ligne"
        DemarcheDescription={DemarcheDescription}
      >
        <OrganisationSection />
        <DonneesSection
          availableScopes={availableScopes}
          DonneesDescription={DonneesDescription}
        />
        <DescriptionSection
          intitulePlaceholder={
            "« Service d'état civil », « service informatique »"
          }
        />
        <CadreJuridiqueSection
          CadreJuridiqueDescription={CadreJuridiqueDescription}
        />
        <MiseEnOeuvreSection initialContacts={contacts} />
        <CguSection cguLink="https://particulier.api.gouv.fr/API_Particulier_modalites.pdf" />
      </Form>
    </div>
  </div>
);

ApiParticulier.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiParticulier.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiParticulier;
