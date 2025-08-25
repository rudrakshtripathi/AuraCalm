# **App Name**: AuraCalm

## Core Features:

- Calming UI Display: Displays a minimalist, calming UI with a prominent animated visualizer.
- Monitoring Control: Allows the user to start and stop microphone monitoring with clear, interactive buttons.
- Audio Recording: Records audio clips using the browser's MediaRecorder API when the user is speaking, or times out after 5 seconds if the user stops talking.
- Speech-to-Text Conversion: Transcribes the recorded audio clip using the Web Speech API (SpeechRecognition).
- AI Stress Analysis: Analyzes transcribed text using the Google Gemini API, extracting a stress score and generating a feedback insight using a tool. The tool's output is structured JSON.
- Calming Intervention Trigger: Triggers a calming intervention if the stress score exceeds 70, including sound, haptics, and visual changes.
- Event Logging: Logs events, such as recording status, analysis completion, and intervention triggering, to keep the user informed of the internal app states.

## Style Guidelines:

- Primary color: Gentle lavender (#E6E6FA) to evoke a sense of peace and tranquility.
- Background color: Very light gray (#F5F5F5), almost white, providing a clean and unobtrusive backdrop.
- Accent color: Soft teal (#A7DBD8), complementing the lavender to highlight interactive elements and provide a visual contrast. DO NOT SUGGEST TEAL, unless the user explicitly requests it.
- Body and headline font: 'Inter', a grotesque-style sans-serif, will lend a modern, neutral, easy-to-read quality to all the text elements of this application.
- Visualizer animation: A circle that gently pulses and subtly changes color based on the stress score.
- Minimalist layout: Prioritize a clean, uncluttered design with generous spacing for a calming visual effect.