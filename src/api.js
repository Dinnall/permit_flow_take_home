import axios from 'axios';


export const submitFormData = async (formData) => {
  try {
    const response = await axios.post('http://localhost:3001/submit-form', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};