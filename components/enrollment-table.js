import React from 'react'
import Head from 'next/head'
import ReactTable from 'react-table'
import withUser from '../components/hoc/with-user'
import Services from '../lib/services'
import Enrollment from '../components/enrollment'

const STATE_HUMAN_NAMES = {
  pending: 'Demande en attente',
  sent: 'Demande envoyée',
  validated: 'Demande validée',
  refused: 'Demande refusée',
  technical_inputs: 'En attente de déploiement', // eslint-disable-line camelcase
  deployed: 'Déployé'
}

const FOURNISSEUR_DE_DONNEES_HUMAN_NAMES = {
  'api-particulier': 'API Particulier',
  'api-entreprise': 'API Entreprise',
  dgfip: 'API Impôts particulier'
}

class EnrollmentTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      enrollments: []
    }
  }

  componentDidMount() {
    Services.getUserEnrollments().then(enrollments => {
      this.setState({enrollments: enrollments.map(enrollment => {
        enrollment.human_state = STATE_HUMAN_NAMES[enrollment.state] // eslint-disable-line camelcase
        enrollment.human_fournisseur_de_donnees = FOURNISSEUR_DE_DONNEES_HUMAN_NAMES[enrollment.fournisseur_de_donnees] // eslint-disable-line camelcase
        return enrollment
      })})
    })
  }

  trigger(action, enrollment) {
    const toto = this.state.enrollments // eslint-disable-line react/destructuring-assignment
    return () => Services.triggerUserEnrollment(action, enrollment).then(response => {
      const enrollment = response.data
      if (enrollment) {
        enrollment.human_state = STATE_HUMAN_NAMES[enrollment.state] // eslint-disable-line camelcase

        const enrollments = toto.map(e => {
          if (enrollment.id === e.id) {
            return enrollment
          }
          return e
        })
        this.setState({enrollments})
      }
    })
  }

  render() {
    const {enrollments} = this.state
    const columns = [
      {
        Header: 'Fournisseur de service',
        accessor: 'demarche.intitule'
      }, {
        Header: 'Type de demande',
        accessor: 'human_fournisseur_de_donnees'
      }, {
        Header: 'Statut',
        accessor: 'human_state'
      }
    ]
    return (
      <div className='enrollment-table'>
        <Head>
          <link rel='stylesheet' href='https://unpkg.com/react-table@latest/react-table.css' />
        </Head>
        <ReactTable
          data={enrollments}
          columns={columns}
          showPageSizeOptions={false}
          pageSize='10'
          previousText='Précédent'
          nextText='Suivant'
          loadingText='Chargement...'
          noDataText='Aucun résultat'
          pageText='Page'
          ofText='sur'
          rowsText='lignes'
          SubComponent={row => (<Enrollment enrollment={row.original} />)} // eslint-disable-line react/jsx-no-bind
        />
      </div>
    )
  }
}

export default withUser(EnrollmentTable)