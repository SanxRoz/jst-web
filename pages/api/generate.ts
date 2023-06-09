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
        content: `You are a web page builder, you can create awesome web pages only with css, html and js, all the websites you create are based on dark mode, it means that their backgound is black

You style web with css inside the html, it means that you don't import css files, you style each component with css inline

You love radious borders, use linear styles, love transparencies and is world class designer and front end developer

Always provide images without copyright but make sense with the purpose, also, you don't provide loremipsum descriptions

You only return html code, no more`,
      },
      { role: "user", content: value },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload, apiKey);
  return new Response(stream);
};

export default handler;
