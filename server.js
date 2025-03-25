require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { IamAuthenticator } = require("ibm-watson/auth");
const AssistantV2 = require("ibm-watson/assistant/v2");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Watson Speech-to-Text Setup
const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({ apikey: process.env.IBM_SPEECH_TO_TEXT_API_KEY }),
    serviceUrl: process.env.IBM_SPEECH_TO_TEXT_URL
});

// 🔹 Watson Assistant Setup
const assistant = new AssistantV2({
    version: "2021-06-14",
    authenticator: new IamAuthenticator({ apikey: process.env.IBM_ASSISTANT_API_KEY }),
    serviceUrl: process.env.IBM_ASSISTANT_URL
});

// 🎤 Speech-to-Text API
app.post("/speech-to-text", async (req, res) => {
    const { audio } = req.body;
    
    const params = {
        audio: Buffer.from(audio, "base64"),
        contentType: "audio/wav",
        model: "en-US_BroadbandModel"
    };

    try {
        const response = await speechToText.recognize(params);
        const transcript = response.result.results.map(r => r.alternatives[0].transcript).join("\n");
        res.json({ text: transcript });
    } catch (error) {
        console.error("Speech-to-Text Error:", error);
        res.status(500).json({ error: "Speech recognition failed" });
    }
});

// 🤖 Watson Assistant Chat API
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await assistant.messageStateless({
            assistantId: process.env.IBM_ASSISTANT_ID,
            input: { text: message },
        });

        console.log("Watson Assistant Response:", JSON.stringify(response.result, null, 2));

        const chatbotResponse = response.result.output.generic?.[0]?.text || "I'm not sure how to respond.";
        res.json({ reply: chatbotResponse });
    } catch (error) {
        console.error("Watson Assistant Error:", error);
        res.status(500).json({ error: "Error connecting to Watson Assistant" });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

