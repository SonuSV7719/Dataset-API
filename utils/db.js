const mongoose = require('mongoose');

const connection = {};

async function connect() {
  if (connection.isConnected) {
    // console.log('already connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  var mongoConnect = await mongoose.connect(process.env.MONGODB_URI, opts);
  console.log('new connection');
  
  connection.isConnected = mongoConnect.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnected) {
    // if (process.env.NODE_ENV === 'production') {
    //   await mongoose.disconnect();
    //   connection.isConnected = false;
    // } else {
      // console.log('not disconnected');
    // }
    await mongoose.disconnect();
    console.log("disconnected!");
  }
}
function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  doc.specifications?.forEach(element => {
    element._id = element._id.toString();
  });
  doc.ratingFeatures?.forEach(element => {
    element._id = element._id.toString();
  });
  try {
    doc.size?.forEach(element => { //todo: remove after complete update
      element._id = element._id.toString();
    });
  } catch (error) {
    console.log(error)
  }
  doc.reviews?.forEach(element => {
    element._id = element._id.toString();
    element.ratingFeatures.forEach(elel => {
      elel._id = elel._id.toString();
    })
  });
  return doc;
}
const createCollection = mongoose.connection; 
const db = { connect, disconnect, convertDocToObj, createCollection };

module.exports = {db};
