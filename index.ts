import mqtt from "mqtt";

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on("error", (err) => {
  console.log("Error:", err);
});

client.subscribe("a-team", () => {
  console.log("Subscribed");
});

const proxyClientWebsocket = mqtt.connect("wss://test.mosquitto.org:8081");

proxyClientWebsocket.subscribe("test-amk-fs2", () => {
  client.on("message", (topic, message) => {
    if (topic === "a-team") {
      const stringData = message.toString();

      proxyClientWebsocket?.publish("test-amk-fs2", Buffer.from(stringData));

      const data = JSON.parse(stringData);

      console.log("message in listener", data);
      console.log(data.value, data.id);
      // client.end();
    }
  });
});