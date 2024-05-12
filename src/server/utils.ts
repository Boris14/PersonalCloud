import { UserData, users } from "./server";

export const isEmailValid = (email: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

export const isNameValid = (name: string): boolean => {
    return /^[а-яА-Яa-zA-Z-]+$/.test(name);
};

export const isPasswordStrong = (password: string): boolean => {
    return /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password);
}

export const getUserData = (email: string): UserData | null => {
    for(let user of users) {
        if(user.email === email) {
            return user;
        }
    }
    return null;
}
export {};
