import type { NextPage } from "next";
import Head from "next/head";
import { CSSProperties } from "react";
import { useRef, useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import LoadingDots from "../components/LoadingDots";
import Image from "next/image";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [generatedBios, setGeneratedBios] = useState<String>("");
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("inputValue");
      setInputValue(storedValue || "");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem("inputValue", newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowInput(false);
  };

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt =
    bio + " add the css and js in one html file" + "%%" + inputValue;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    setSubmitted(true);

    console.log(prompt);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = "";
    let foundFirstDelimiter = false;
    let foundSecondDelimiter = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      buffer += chunkValue;

      // Look for the first delimiter
      if (!foundFirstDelimiter) {
        const firstDelimiterIndex = buffer.indexOf("```");
        if (firstDelimiterIndex >= 0) {
          // Remove the data before the first delimiter
          buffer = buffer.slice(firstDelimiterIndex + 6);
          foundFirstDelimiter = true;
        }
      }

      // Look for the second delimiter
      if (foundFirstDelimiter && !foundSecondDelimiter) {
        const secondDelimiterIndex = buffer.indexOf("```");
        if (secondDelimiterIndex >= 0) {
          // Print the data between the delimiters
          const data = buffer.slice(0, secondDelimiterIndex);
          console.log(data);
          setGeneratedBios(data);
          foundSecondDelimiter = true;
          break;
        }
      }
    }

    scrollToBios();
    setLoading(false);
  };

  const footerStyles: CSSProperties = {
    position: submitted ? "fixed" : "static",
  };

  return (
    <div className="flex px-[3%] mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Jst Web</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute top-0 py-2">
        {!showInput && (
          <button
            className="px-5 py-2 border border-solid border-[#00000033] rounded-full bg-[#ffffff26] shadow-[inset_0_1px_0_0_rgb(255,255,255,10%)] hover:shadow-2xl"
            onClick={handleButtonClick}
          >
            OpenAI Key
          </button>
        )}
        {showInput && (
          <form
            className="p-1.5 gap-1 rounded-full py-2 border border-solid border-[#00000033] rounded-full bg-[#ffffff26] shadow-[inset_0_1px_0_0_rgb(255,255,255,10%)] flex"
            onSubmit={handleSubmit}
          >
            <input
              className="w-full border-0 placeholder:text-[#aaa] bg-transparent px-3 py-2 rounded-full focus:outline-none focus:border-0"
              id="input"
              type="password"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={"Enter OpenAI key"}
            />
            <button
              className="bg-[#FD330A] shadow-[inset_0_1px_0_0_rgb(255,255,255,10%)] border border-[#B62002] rounded-full text-white font-medium px-4 py-2 hover:bg-[#FD330A] w-fit"
              type="submit"
            >
              Save
            </button>
          </form>
        )}
      </div>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:text sm:mt-20">
        <div className="max-w-xl w-full">
          <div className="flex font-medium my-5 items-center space-x-1">
            Pls provide your OpenAI key on the upper part and then you can start
            creating webpages!
          </div>
        </div>

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="flex flex-row-reverse gap-3 w-[100%] justify-center mb-8">
          <div
            className="w-full justify-center bottom-0 left-0 gap-3 px-2 flex pb-2"
            style={footerStyles}
          >
            <footer className="md:max-w-[50%] w-full pt-0 flex justify-center">
              <div className="p-1.5 w-full gap-1 rounded-full py-2 border border-solid border-[#00000033] rounded-full bg-[#333] shadow-[inset_0_1px_0_0_rgb(255,255,255,10%)] flex">
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full placeholder:text-[#B1AFA9] placeholder:italic bg-transparent px-3 py-2 rounded-full focus:outline-none focus:border-sky-500"
                  placeholder={"Create a website for..."}
                />

                {!loading && (
                  <button
                    className="bg-[#FD330A] shadow-[inset_0_2px_0_0_rgb(255,255,255,10%)] border border-[#B62002] rounded-full text-white font-medium px-4 py-2 w-fit"
                    onClick={(e) => generateBio(e)}
                  >
                    Create
                  </button>
                )}
                {loading && (
                  <button
                    className="bg-[#FD330A] shadow-[inset_0_2px_0_0_rgb(255,255,255,10%)] border border-[#B62002] rounded-full text-white font-medium px-4 py-2 w-fit"
                    disabled
                  >
                    <LoadingDots color="white" style="large" />
                  </button>
                )}
              </div>
            </footer>
            {generatedBios && (
              <div className="p-1.5 gap-1 rounded-full py-2 border border-solid border-[#00000033] rounded-full bg-[#333] shadow-[inset_0_1px_0_0_rgb(255,255,255,10%)] flex">
                <button
                  className="bg-[#FD330A] shadow-[inset_0_2px_0_0_rgb(255,255,255,10%)] border border-[#B62002] rounded-full text-white font-medium px-4 py-2 w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedBios.toString());
                    toast("Copied to clipboard");
                  }}
                >
                  Copy
                </button>
              </div>
            )}
          </div>

          {generatedBios && (
            <div className="w-[70%] mb-[4rem] border border-[#ffffff26] h-screen bg-[#ffffff1a] p-8 m-0 rounded-2xl">
              <iframe
                className="w-full h-full"
                srcDoc={generatedBios.toString()}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
