import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const [value, apiKey]: string[] = prompt.split("%%");

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You create webpages on html and you style them on the html structure, you're a top designer and, return everything on html, you don't explain your approarch, just return html",
      },
      { role: "user", content: value },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload, apiKey);
  return new Response(stream);
};

export default handler;
