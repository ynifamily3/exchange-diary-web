interface Weather {
  temp: number;
  weather: string;
}

export const weather = async (): Promise<Weather> => {
  return new Promise((resolve, reject) => {
    console.log("touch weather");
    setTimeout(() => {
      resolve({
        temp: 20,
        weather: "sunny" + Math.random(),
      });
    }, 0);
  });
};
