import { FormEventHandler, ChangeEventHandler, useState } from "react";

import Card from "../components/Card/Card";

export default function InputChat() {
  const [translationKey, setTranslationKey] = useState("");
  const [originalMessage, setOriginalMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const playAudio = () => {
    const audio = new Audio("/public/blip.mp3");
    audio.play();
  };

  const handleTranslationKeyChange: ChangeEventHandler<
    HTMLInputElement
  > = event => {
    setTranslationKey(event.target.value);
  };

  const handleOriginalMessageChange: ChangeEventHandler<
    HTMLTextAreaElement
  > = event => {
    setOriginalMessage(event.target.value);
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = async event => {
    setHasError(false);
    setIsLoading(true);
    setResponseMessage("");
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const response = await fetch("/api/chat", {
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) {
      setIsLoading(false);
      setHasError(true);
    }

    const data = await response.json();
    const message = JSON.parse(data.message);

    if (message) {
      setIsLoading(false);
      setResponseMessage(message);
      playAudio();
    }
  };

  return (
    <form
      onSubmit={handleSubmitForm}
      className="flex flex-col items-center gap-4 py-10"
    >
      <div className="flex w-full flex-col gap-3">
        <label className="flex w-[30%] flex-col gap-1">
          Key
          <input
            onChange={handleTranslationKeyChange}
            className="rounded-lg border-2 border-solid border-violet-500 caret-violet-500 outline-none focus:caret-violet-700"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1">
          Message
          <textarea
            id="message"
            name="message"
            rows={5}
            onChange={handleOriginalMessageChange}
            className="rounded-lg border-2 border-solid border-violet-500 caret-violet-500 outline-none focus:caret-violet-700"
          />
        </label>
      </div>

      <button
        disabled={isLoading}
        className="rounded-bl-lg rounded-tr-lg bg-violet-500 px-7 py-3 text-lg font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-pink-500 hover:shadow-xl focus:scale-95 focus:bg-violet-700 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-violet-200 disabled:shadow-md"
        type="submit"
      >
        Translate
      </button>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {hasError && <p>Something went wrong!</p>}
          {responseMessage && (
            <ul className="grid w-[100%] grid-cols-1 gap-4">
              <Card
                title={"español"}
                translationKey={translationKey}
                body={originalMessage}
              />
              {Object.entries(responseMessage).map(([language, value]) => (
                <Card
                  key={language}
                  title={language}
                  translationKey={translationKey}
                  body={value}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </form>
  );
}
