module.exports = async () => {
  await globalThis.mySQLContainer.stop();
};
