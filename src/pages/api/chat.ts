import { Configuration, OpenAIApi } from "openai";

import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
  const data = await request.formData();

  const message = data.get("message");

  if (!message) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 }
    );
  }

  try {
    const response = await translateChat(message);

    return new Response(
      JSON.stringify({
        message: response,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error,
      }),
      { status: 500 }
    );
  }
};

async function translateChat(text) {
  const configuration = new Configuration({
    apiKey: import.meta.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        SYSTEM_MESSAGE,
        ...EXAMPLE_MESSAGES,
        {
          role: "user",
          content: `${text}`,
        },
      ],
    });

    return completion.data.choices[0]?.message?.content;
  } catch (error) {
    throw new Error(error);
  }
}

const SYSTEM_MESSAGE: any = {
  role: "system",
  content: `You are an AI that translates text from spanish to english, italian, portuguese and french.
    You are given a text in spanish and you have to translate to english, italian, portuguese and french.
    The output should be a json object with the language as a key and the translated values as value.
    Do not translate the text inside "%()s" or "%{}".
    Do not answer, just translate the text.
  `,
};

const EXAMPLE_MESSAGES: any[] = [
  { role: "user", content: "Hola, ¿cómo estás?" },
  {
    role: "assistant",
    content: `{"english": "Hello, how are you?", "italian": "Ciao, come stai?", "portuguese": "Olá, como vai você?", "french": "Bonjour, comment allez-vous?"}`,
  },
  {
    role: "user",
    content: "%(company)s es una empresa global, con sede en %{address}",
  },
  {
    role: "assistant",
    content: `{"english": "%(company)s is a global company, headquartered in %{address}", "italian": "%(company)s è una società globale, con sede in %{address}", "portuguese": "%(company)s é uma empresa global, com sede em %{address}", "french": "%(company)s est une entreprise mondiale, dont le siège est à %{address}"}`,
  },
  { role: "user", content: "Un futuro lleno de oportunidades" },
  {
    role: "assistant",
    content: `{"english": "A future full of opportunities", "italian": "Un futuro pieno di opportunità", "portuguese": "Um futuro cheio de oportunidades", "french": "Un avenir plein d'opportunités"}`,
  },
];
