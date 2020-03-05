import React from 'react';
import PropTypes from 'prop-types';
import { isObject } from 'lodash';
import { withRouter } from 'react-router-dom';
import './Nav.css';
import ArrowBackIcon from './icons/arrow-back';
import { ScrollableLink } from './Scrollable';
import LocalPhoneIcon from './icons/local-phone';

const Nav = ({ logo, navLinks, contactInformation, history }) => {
  const goBack = e => {
    if (isObject(history.location.state) && history.location.state.fromList) {
      return history.goBack();
    }

    return history.push('/');
  };

  return (
    <aside className="side-menu" role="navigation">
      <div className="side-menu-container">
        <ul>
          <li>
            <button
              className="light"
              onClick={goBack}
              style={{ color: 'var(--theme-primary)' }}
            >
              <span style={{ verticalAlign: 'sub' }}>
                <ArrowBackIcon color={'var(--theme-primary)'} size={20} />
              </span>
              Retour à mes demandes
            </button>
          </li>
        </ul>
        <ul className="form-nav">
          {logo && (
            <li>
              <a href={logo.url}>
                <img alt={logo.alt} src={logo.src} className="form-nav-logo" />
              </a>
            </li>
          )}
          {navLinks.map(({ id, label }) => (
            <ScrollableLink key={id} scrollableId={id}>
              {label}
            </ScrollableLink>
          ))}
        </ul>

        {contactInformation && (
          <div className="section section-grey help-links">
            <div className="container">
              <h3>Une question&nbsp;?</h3>

              <div className="contact-button-list">
                {contactInformation.map(({ tel, email, label, subject }) =>
                  tel ? (
                    <a
                      key={tel}
                      className="button-outline primary"
                      href={`tel:${tel}`}
                    >
                      <LocalPhoneIcon color="var(--blue)" />
                      {tel}
                    </a>
                  ) : (
                    <a
                      key={label}
                      className="button-outline primary"
                      href={`mailto:${email}?subject=${subject}`}
                    >
                      {label}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

Nav.propTypes = {
  navLinks: PropTypes.array.isRequired,
  contactInformation: PropTypes.array,
  logo: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        fromList: PropTypes.bool,
      }),
    }),
  }),
};

export default withRouter(Nav);
