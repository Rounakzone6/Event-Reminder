export async function generateOccasionMessage({
  age,
  event_type,
  relation,
}) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful assistant that writes warm, heartfelt, and joyful greeting messages for personal occasions like birthdays and anniversaries.",
    },
    {
      role: "user",
      content: `Generate a sincere and uplifting ${event_type} message for someone turning ${age}. The message should sound like it's from a close ${relation}, about 50–60 words long. Do not include any names or sender info.`,
    },
  ];

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages,
      }),
    }
  );

  const data = await response.json();

  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  } else {
    throw new Error("No response from Groq AI");
  }
}
