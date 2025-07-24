import userModal from "../models/userModel.js";
import { generateOccasionMessage } from "../utils/reminder.js";
import axios from "axios";

// function to get the age/years
function getYearsSince(dateString) {
  const today = new Date();
  const date = new Date(dateString);
  let years = today.getFullYear() - date.getFullYear();
  const beforeAnniversary =
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());
  if (beforeAnniversary) years--;
  return years;
}

export async function checkAndSendMessages() {
  const users = await userModal.find();
  const today = new Date();

  for (const user of users) {
    const sender_name = user.name;

    for (const ev of user.events) {
      const eventDate = new Date(ev.date);
      
      if (
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth()
      ) {
        const age = getYearsSince(ev.date);
        const recipient_name = ev.name;
        const event_type=ev.event;
        const custom_message = await generateOccasionMessage({
          age,
          event_type,
          relation: ev.relation,
        });

        const imageUrl = `https://dummyimage.com/600x400/000/fff.png&text=Happy+${encodeURIComponent(
          event_type
        )}`;

        try {
          const response = await axios({
            url: "https://graph.facebook.com/v22.0/768363456352633/messages",
            method: "post",
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
            data: {
              messaging_product: "whatsapp",
              to: `91${ev.phone}`,
              type: "template",
              template: {
                name: "ai_generated_greetings",
                language: {
                  code: "en",
                },
                components: [
                  {
                    type: "header",
                    parameters: [
                      {
                        type: "image",
                        image: {
                          link: imageUrl,
                        },
                      },
                    ],
                  },
                  {
                    type: "body",
                    parameters: [
                      { type: "text", text: recipient_name },
                      { type: "text", text: event_type },
                      { type: "text", text: custom_message },
                      { type: "text", text: sender_name },
                    ],
                  },
                ],
              },
            },
          });
          console.log(response.data);
        } catch (error) {
          console.error("WhatsApp API Error:",error.response?.data || error.message);
        }
      }
    }
  }
}
