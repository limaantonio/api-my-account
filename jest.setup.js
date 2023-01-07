process.on('unhandledRejection', (reason, promise) => {
  console.log('unhandledRejection', reason, promise);
});