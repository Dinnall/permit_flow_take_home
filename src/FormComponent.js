import React, { useState } from 'react';
import { submitFormData } from './api';
import './FormComponent.css'; 






const FormComponent = () => {

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    workType: '',
    interiorWork: [],
    exteriorWork: [],
  });
  const [requirements, setRequirements] = useState('');
  const [requirementDetails, setRequirementDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'interiorWork' || name === 'exteriorWork') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: prevData[name].includes(value)
          ? prevData[name].filter((item) => item !== value) 
          : [...prevData[name], value], 
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => {
    if (isSubmitted) {
      setFormData({
        workType: '',
        interiorWork: [],
        exteriorWork: [],
      });
      setRequirements('');
      setRequirementDetails('');
      setIsSubmitted(false);
      setStep(0); 
    } else {
      setStep((prevStep) => prevStep - 1);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { workType, interiorWork, exteriorWork } = formData;


    // Determine requirements based on selections
    if (workType === 'Interior work') {
      if (interiorWork.length === 1 && interiorWork.includes('Bathroom remodel')) {
        setRequirements('✅ Over-the-Counter Submission Process');
        setRequirementDetails(
          <ul>
            <li>A building permit is required.</li>
            <li>Submit application for OTC review.</li>
          </ul>
        );
      } else {
        setRequirements('✅ In-House Review Process');
        setRequirementDetails(
          <ul>
            <li>A building permit is required.</li>
            <li>Include plan sets.</li>
            <li>Submit application for in-house review.</li>
          </ul>
        );
      }
    } else if (workType === 'Exterior work') {
      if (exteriorWork.includes('Other')) {
        setRequirements('✅ In-House Review Process');
        setRequirementDetails(
          <ul>
            <li>A building permit is required.</li>
            <li>Include plan sets.</li>
            <li>Submit application for in-house review.</li>
          </ul>
        );
      } else if (exteriorWork.includes('Garage door replacement') && exteriorWork.includes('Exterior doors')) {
        setRequirements('✅ Over-the-Counter Submission Process');
        setRequirementDetails(
          <ul>
            <li>A building permit is required.</li>
            <li>Submit application for OTC review.</li>
          </ul>
        );
      } else {
        setRequirements('❌ No Permit');
        setRequirementDetails(
          <ul>
            <li>Nothing is required! You’re set to build.</li>
          </ul>
        );
      }
    }

    try {
      const result = await submitFormData(formData);
      console.log('Submission successful:', result);
      setIsSubmitted(true); 
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const isNextDisabled = () => {
    if (step === 0) {
      return !formData.workType;
    } else if (step === 1 && formData.workType === 'Interior work') {
      return formData.interiorWork.length === 0;
    } else if (step === 1 && formData.workType === 'Exterior work') {
      return formData.exteriorWork.length === 0;
    }
    return false;
  };
  return (
    <div className="body-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <div className="form-step">
              <label>
                Work Type:
                <select name="workType" value={formData.workType} onChange={handleChange} className="form-select">
                  <option value="">Select</option>
                  <option value="Interior work">Interior work</option>
                  <option value="Exterior work">Exterior work</option>
                </select>
              </label>
              <button type="button" className="form-button" onClick={nextStep} disabled={isNextDisabled()}>Next</button>
            </div>
          )}
          {step === 1 && formData.workType === 'Interior work' && (
            <div className="form-step">
              <h3>What interior work are you doing?</h3>
              {['Bathroom remodel', 'New bathroom', 'New laundry room', 'Other'].map((option) => (
                <label key={option} className="form-checkbox-label">
                  <input type="checkbox" name="interiorWork" value={option} onChange={handleChange} className="form-checkbox"/>
                  {option}
                </label>
              ))}
              <button type="button" className="form-button" onClick={prevStep}>Back</button>
              <button type="button" className="form-button" onClick={nextStep} disabled={isNextDisabled()}>Next</button>
            </div>
          )}
          {step === 1 && formData.workType === 'Exterior work' && (
            <div className="form-step">
              <h3>What exterior work are you doing?</h3>
              {['Garage door replacement', 'Exterior doors', 'Fencing', 'Other'].map((option) => (
                <label key={option} className="form-checkbox-label">
                  <input type="checkbox" name="exteriorWork" value={option} onChange={handleChange} className="form-checkbox"/>
                  {option}
                </label>
              ))}
              <button type="button" className="form-button" onClick={prevStep}>Back</button>
              <button type="button" className="form-button" onClick={nextStep} disabled={isNextDisabled()}>Next</button>
            </div>
          )}
          {step === 2 && (
            <div className="form-step">
              <h3>Review your answers:</h3>
              <p>Work Type: {formData.workType}</p>
              <p>Interior Work: {formData.interiorWork.join(', ')}</p>
              <p>Exterior Work: {formData.exteriorWork.join(', ')}</p>
              <p>Requirements: {requirements}</p>
              {requirementDetails}
              <button type="button" className="form-button" onClick={prevStep}>Back</button>
              <button type="submit" className="form-button">Submit</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
export default FormComponent;