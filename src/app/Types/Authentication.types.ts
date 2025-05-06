export interface registeredUser {
  name: string;
  email: string;
  password: string;
}

export interface loginUser {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type loginResponse = {
  token: string;
};

export type registerResponse = {
  success: boolean;
  message: string;
};
