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
    apiKey: import.meta.env.OPENAI_API_KEY_ALT,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4-turbo",
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
    You could receive a text in a json format, leave the keys as they are, just translate the values.
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
  {
    role: "user",
    content: `{"title": "¿Cómo invierto en un proyecto?"}`,
  },
  {
    role: "assistant",
    content: `{ "english": { "title": "How do I invest in a project?" }, "italian": { "title": "Come investo in un progetto?" }, "portuguese": { "title": "Como eu invisto em um projeto?" }, "french": { "title": "Comment investir dans un projet?" } }`,
  },
  {
    role: "user",
    content: ` "9": { "title": "¿Cuál es la cantidad %(bold)s de inversión?", "titleBold1": "mínima", }, "10": { "title": "¿Cuál es la cantidad %(bold)s de inversión?", "titleBold": "máxima" }, `,
  },
  {
    role: "assistant",
    content: ` "english": { "9": { "title": "What is the %(bold)s amount of investment?", "titleBold1": "minimum" }, "10": { "title": "What is the %(bold)s amount of investment?", "titleBold": "maximum" }, }, "italian": { "9": { "title": "Qual è l'importo %(bold)s dell'investimento?", "titleBold1": "minimo" }, "10": { "title": "Qual è l'importo %(bold)s dell'investimento?", "titleBold": "massimo" }, }, "portuguese": { "9": { "title": "Qual é o valor %(bold)s do investimento?", "titleBold1": "mínimo" }, "10": { "title": "Qual é o valor %(bold)s do investimento?", "titleBold": "máximo" }, }, "french": { "9": { "title": "Quel est le montant %(bold)s de l'investissement?", "titleBold1": "minimum" }, "10": { "title": "Quel est le montant %(bold)s de l'investissement?", "titleBold": "maximum" }, } `,
  },
];
