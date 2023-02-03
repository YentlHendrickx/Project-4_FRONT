export const getAuthImage = () => {
  const rand = Math.floor(Math.random() * (5 - 1 + 1) + 1);
  return `/authImages/auth${rand}.jpg`;
};
