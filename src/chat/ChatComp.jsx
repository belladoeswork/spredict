// import openAi from "../lib/utils.jsx";
"use client"

import { useState, useEffect } from 'react';
import { OpenAI } from "openai";



export default function Generate() {

  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchData = async () => {

  const openAi = new OpenAI({ dangerouslyAllowBrowser: true });

  const completion = await openAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Who invented the television?" },
    ],
  });
      // setResponse(completion);
      console.log(completion);

};

fetchData();
}, []);



  return (
    <div>
      <h1>OpenAI Chat</h1>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  )

}
