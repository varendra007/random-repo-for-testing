const logout = () => {};
localStorage.removeItem('jwtToken');
window.history.go(-(window.history.length - 1));
// window.location = '/';
export default logout;
