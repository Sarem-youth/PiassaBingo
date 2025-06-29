import { supabase } from '../supabase';

const login = async (username, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  return data;
};

const logout = () => {
  supabase.auth.signOut();
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;
