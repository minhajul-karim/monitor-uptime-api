interface Worker {
  gatherAllChecks: () => void;
  loop: () => void;
  init: () => void;
}

const worker = {} as Worker;

worker.gatherAllChecks = () => {
  // Gather all checks
  console.log('gathering all checks');
};

worker.loop = () => {
  setInterval(
    () => {
      worker.gatherAllChecks();
    },
    1 * 60 * 1000,
  );
};

worker.init = () => {
  worker.gatherAllChecks();
  worker.loop();
};

export default worker;
