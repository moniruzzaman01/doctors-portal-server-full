const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0uupc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("doctorsPortal").collection("services");
    const appointmentCollection = client
      .db("doctorsPortal")
      .collection("appointments");

    //----------------------------
    app.get("/services", async (req, res) => {
      const date = req.query.date;
      const services = await serviceCollection.find().toArray();
      const appointments = await appointmentCollection.find({ date }).toArray();
      services.forEach((service) => {
        const bookedAppointments = appointments.filter(
          (x) => x.treatmentName === service.name
        );
        const bookedSlots = bookedAppointments.map((x) => x.slot);
        const availableSlots = service.slots.filter(
          (x) => !bookedSlots.includes(x)
        );
        service.slots = availableSlots;
      });
      res.send(services);
    });

    app.post("/appointment", async (req, res) => {
      const appointment = req.body;
      const result = await appointmentCollection.insertOne(appointment);
      res.send(result);
    });

    app.get("/appointmentByEmail/:email", async (req, res) => {
      const email = req.params.email;
      const result = await appointmentCollection
        .find({ patientEmail: email })
        .toArray();
      res.send(result);
    });
    //------------------------------
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

//check server
app.get("/", async (req, res) => {
  res.send("Doctor Uncle Rocking!!!");
});
app.listen(port, () => {
  console.log("doctor uncle listening from", port);
});
