import api from "./axios";


export async function registerUser(
  username,
  email,
  password
) {
  const { data } = await api.post(
    "auth/register/",
    {
      username,
      email,
      password,
    }
  );

  return data;
}


export async function loginUser(
  username,
  password
) {
  const { data } = await api.post(
    "auth/login/",
    {
      username,
      password,
    }
  );

  // Save JWT tokens
  localStorage.setItem(
    "accessToken",
    data.access
  );

  localStorage.setItem(
    "refreshToken",
    data.refresh
  );

  // Save username
  localStorage.setItem(
    "username",
    username
  );

  return data;
}

export function logoutUser() {

  localStorage.removeItem(
    "accessToken"
  );

  localStorage.removeItem(
    "refreshToken"
  );

}


export function isAuthenticated() {

  return !!localStorage.getItem(
    "accessToken"
  );

}