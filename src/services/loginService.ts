import { LoginData } from "../client/components/LoginForm";
import { UserData } from "../server/server";

export const handleLogin = async (loginData: LoginData) => {
    const { email, password } = loginData;
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const userData: UserData = await response.json();
        console.log(userData);
        return userData;
      } else if (response.status === 404) {
        console.error('User not found');
      } else if (response.status === 403) {
        console.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
    return null;
  };
  