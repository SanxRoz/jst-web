import type { NextPage } from "next";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [generatedBios, setGeneratedBios] = useState<String>("");
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);

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

  const prompt = bio + "%%" + inputValue;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);

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

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Jst Web</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {!showInput && (
          <button
            className="fixed px-5 text-[#efece6] py-2 border border-solid border-[#00000033] rounded-full bg-[#ffffff26] shadow-[inset_0_1px_0_0_rgb(255,255,255,10%)] hover:shadow-2xl"
            onClick={handleButtonClick}
          >
            OpenAI Key
          </button>
        )}
        {showInput && (
          <form
            className="p-1.5 gap-1 rounded-full text-[#efece6] py-2 border border-solid border-[#00000033] rounded-full bg-[#ffffff26] shadow-[inset_0_1px_0_0_rgb(255,255,255,10%)] flex"
            onSubmit={handleSubmit}
          >
            <input
              className="w-full border-0 text-[#efece6] placeholder:text-[#aaa] bg-transparent px-3 py-2 rounded-full focus:outline-none focus:border-0"
              id="input"
              type="password"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={"Enter OpenAI key"}
            />
            <button
              className="bg-[#222] shadow-[inset_0_1px_0_0_rgb(255,255,255,10%)] border border-[#000] rounded-full text-white font-medium px-4 py-2 hover:bg-[#222] w-fit"
              type="submit"
            >
              Save
            </button>
          </form>
        )}
      </div>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:text sm:mt-20">
        <h1 className="sm:text-9xl text-[#efece6] text-7xl max-w-[708px] font-bold">
          Jst Web
        </h1>
        <div className="max-w-xl w-full">
          <div className="flex mt-5 items-center space-x-1"></div>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-5">
          {generatedBios && (
            <>
              <div id="generated-bios">
                <div
                  className="space-y-8 flex flex-col bg-[#ffffff0a] p-8 rounded-2xl text-[#ffffffcc] items-center justify-center max-w-xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: generatedBios.toString() }}
                ></div>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="fixed min-w-[50%] bottom-0 flex justify-center pb-2">
        <div className="p-1.5 w-full gap-1 mt-5 rounded-full text-[#efece6] py-2 border border-solid border-[#00000033] rounded-full bg-[#333] shadow-[inset_0_1px_0_0_rgb(255,255,255,10%)] flex">
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full text-[#efece6] placeholder:text-[#aaa] bg-transparent px-3 py-2 rounded-full focus:outline-none focus:border-sky-500"
            placeholder={"Roast Me"}
          />

          {!loading && (
            <button
              className="bg-[#222] shadow-[inset_0_2px_0_0_rgb(255,255,255,10%)] border border-[#000] rounded-full text-white font-medium px-4 py-2 hover:bg-[#222] w-fit"
              onClick={(e) => generateBio(e)}
            >
              Roast
            </button>
          )}
          {loading && (
            <button
              className="bg-[#222] shadow-[inset_0_2px_0_0_rgb(255,255,255,10%)] border border-[#000] rounded-full text-white font-medium px-4 py-2 hover:bg-[#222] w-fit"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Home;
