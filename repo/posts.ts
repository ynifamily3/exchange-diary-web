export const getPosts = async () => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      console.log("touch posts");
      resolve({ data: [1, 2, 3, Math.random()] });
    }, 0);
  });
};
