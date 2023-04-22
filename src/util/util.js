export function SupportWorkerModules() {
  let isSupport = false;
  const tester = {
    get type() { isSupport = true; } // it's been called, it's supported
  };

  try {

    new Worker('blob://', tester).terminate()
  } finally {

    return isSupport
  }
}

export function prepareRunChecker({timeDelay}) {
  let lastEvent = Date.now();

  return {
    shouldRun() {

      const should = (Date.now() - lastEvent) > timeDelay; 
      if(should) lastEvent = Date.now();

      return should; 
    }
  }
}