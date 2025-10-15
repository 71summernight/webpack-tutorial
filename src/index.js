const arrowFunction = () => {
    return "Hello, Babel!";
  };
  
  const promiseExample = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Promise resolved!"), 1000);
  });
  
  promiseExample.then(console.log);
  
  console.log(arrowFunction());