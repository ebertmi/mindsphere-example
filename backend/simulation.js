// simulate data ingest
//sin(2*pi * f_in .* t);

let intervalId;

process.on('message', (msg) => {
  console.log('Message from parent:', msg);

  // msg format to expect {action: START|STOP, target: {assetId: string, aspectName: string, variables: string}, intervalValue}

});

function startIngest(target) {
  stopIngest();

  // ToDo
  intervalId = setInterval(() => {
    // compute value
    // write value
  }, 1000);
}

function stopIngest() {
  if (intervalId != null) {
    clearInterval(intervalId);
  }
}

function writeTSValues(time, assetId, aspectName, values) {
  // ToDo
}