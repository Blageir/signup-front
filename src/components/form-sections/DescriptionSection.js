import React, { useContext } from 'react';
import { ScrollablePanel } from '../Scrollable';
import Helper from '../Helper';
import { FormContext } from '../Form';
import PropTypes from 'prop-types';

const DescriptionSection = ({
  intitulePlaceholder = '',
  descriptionPlaceholder = '',
  descriptionHelper = null,
}) => {
  const {
    disabled,
    onChange,
    enrollment: { intitule = '', description = '' },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId="description">
      <h2>Description du(des) service(s)</h2>
      <div className="form__group">
        <label htmlFor="detailed-description">
          Description détaillée
          <Helper
            title={
              descriptionHelper
                ? descriptionHelper
                : 'À quoi sert le service numérique qui consommera la donnée ?'
            }
          />
        </label>
        <textarea
          rows="10"
          onChange={onChange}
          name="description"
          id="detailed-description"
          readOnly={disabled}
          value={description}
          placeholder={descriptionPlaceholder}
        />
      </div>
    </ScrollablePanel>
  );
};

DescriptionSection.propTypes = {
  intitulePlaceholder: PropTypes.string,
  descriptionPlaceholder: PropTypes.string,
  descriptionHelper: PropTypes.string,
};

export default DescriptionSection;
