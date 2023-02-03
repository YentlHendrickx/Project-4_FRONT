export const getAuthImage = () => {
  const rand = Math.floor(Math.random() * (10 - 1 + 1) + 1);
  return `/authImages/auth${rand}.webp`;
};
