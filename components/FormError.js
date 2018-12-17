import React from 'react';
import { Alert } from 'antd';

const onClose = function (e) {
  console.log(e, 'I was closed.');
};


export const FormErrors = ({ formErrors }) =>
  <div className='formErrors'>
    {Object.keys(formErrors).map((fieldName, i) => {
      if (formErrors[fieldName].length > 0) {
        return (
          <div style={{margin: '1em'}}>
          <Alert
            showIcon
            key={i}
            message="คำแนะนำ"
            description={formErrors[fieldName]}
            type="warning"
            closable
            banner 
            closable
          />
          </div>
        )
      } else {
        return '';
      }
    })}
  </div>