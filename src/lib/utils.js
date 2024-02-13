import { OpenAI } from "openai";



const openAi = new OpenAI(process.env.OPENAI_API_KEY);

// const openAi = new OpenAI({dangerouslyAllowBrowser: true});

export default openAi;