export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.session && user.session.access_token) {
    return { 'x-access-token': user.session.access_token };
  } else {
    return {};
  }
}
