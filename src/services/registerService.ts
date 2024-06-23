import { RegistrationData } from "../client/components/RegistrationForm";

export const handleRegister = async (registrationData: RegistrationData) => {
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else if (response.status === 400 || response.status === 409) {
        console.log('User registration failed:', await response.text());
      }
    } catch (error) {
        console.log('Error during registration:', error);
    }
    return null;
  };

export {};