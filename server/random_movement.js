const Scaledrone = require('scaledrone-node');
const fetch = require('node-fetch');
const SCALEDRONE_CHANNEL_ID = require('./scaledrone_channel_id.json');

const locations = [
  {name: 'Bob', longitude: -122.164275, latitude: 37.442909},
  {name: 'Alice', longitude: -122.002131, latitude: 37.409883},
  {name: 'John', longitude: -122.076628, latitude: 37.394109},
];

function doAuthRequest(clientId, name) {
  let status;
  return fetch('http://localhost:3000/auth', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({clientId, name})
  }).then(res => {
    status = res.status;
    return res.text();
  }).then(text => {
    if (status === 200) {
      return text;
    } else {
      console.error(text);
    }
  }).catch(error => console.error(error));
}

locations.forEach(location => {
  const drone = new Scaledrone(SCALEDRONE_CHANNEL_ID);
  drone.on('error', error => console.error(error));
  drone.on('open', error => {
    if (error) {
      return console.error(error);
    }
    doAuthRequest(drone.clientId, location.name)
      .then(jwt => drone.authenticate(jwt));
  });
  drone.on('authenticate', error => {
    if (error) {
      return console.error(error);
    }
    setInterval(() => {
      const delta = moveInRandomDirection();
      location.latitude += delta.dlat;
      location.longitude += delta.dlon;
      drone.publish({
        room: 'observable-locations',
        message: location
      });
    }, 1000);
  });
  // subscribe so our data is avaiable to the observable room
  drone.subscribe('observable-locations');
});

function moveInRandomDirection(maxDistance = 0.005) {
  const angle = Math.random() * Math.PI * 2;
  const distance = maxDistance * Math.random();
  return {
    dlat: Math.cos(angle) * distance,
    dlon: Math.sin(angle) * distance,
  };
}
