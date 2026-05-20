import axios from "axios";
import { getChannel } from "./rabbitmq.js";
import { Rider } from "../model/Rider.js";


export const startOrderReadyConsumer = async () => {
  const channel = getChannel()

  console.log("Starting to consume from :", process.env.ORDER_READY_QUEUE);
  channel.consume(process.env.ORDER_READY_QUEUE!, async (msg) => {
    if (!msg) return;
    try {
      console.log("Received Message", msg.content.toString());

      const event = JSON.parse(msg.content.toString());

      console.log("Event type", event.type)


      if (event.type !== "ORDER_READY_FOR_RIDER") {
        console.log("skipping non-order-ready-for-rider event ");

        channel.ack(msg);
        return;

      }

      const {
        orderId,
        restaurantId,
        location
      } = event.data;

      console.log("Searching for rider near:", location);

      const rider = await Rider.find({
        isAvailable: true,
        isVerified: true,
        location: {
          $near: {
            $geometry: location,
            $maxDistance: 2000,

          }
        }
      })
      console.log(`Found ${rider.length} nearby riders`);

      if (rider.length === 0) {
        console.log("No  rider avaiable nearby. ")
        channel.ack(msg);
        return;

      }

      for (const riders of rider) {
        console.log(`Notifying rider userID :${riders.userId}`);

        try {
          await axios.post(`${process.env.REALTIME_SERVICE}/api/internal/emit`, {


            event: "orer:available",
            room: `user:${riders.userId}`,
            payload: { orderId, restaurantId }
          }, {

            headers: {
              "x-internal-key": process.env.INTERNAL_SERVICE_KEY,
            }
          });
          console.log(`Notified rider ${riders.userId} successfully`)

        } catch (error) {
          console.log(`Failed to Notifiy rider ${riders.userId}`);


        }
      }

      channel.ack(msg);
      console.log("Message Acknowldge")
    } catch (error) {
      console.log("OrderReady consumer error: ", error);

    }

  })
}
