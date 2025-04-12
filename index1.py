import speech_recognition as sr 
import webbrowser
import pyttsx3
import requests
import openai  # Correct import
from dotenv import load_dotenv  # For API keys
import os

# Load environment variables
load_dotenv()

recognizer = sr.Recognizer()
tts = pyttsx3.init()

# Initialize OpenAI client
client = openai.OpenAI(api_key=os.getenv("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"))  # Store key in .env file

def speak(text):
    tts.say(text)
    tts.runAndWait()

def get_ai_response(prompt):
    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Use valid model name
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"AI Error: {str(e)}"

def process_command(command):
    command = command.lower()
    try:
        if "open google" in command:
            webbrowser.open("https://google.com")
            return "Opening Google"
            
        elif "open youtube" in command:
            webbrowser.open("https://youtube.com")
            return "Opening YouTube"
            
        elif "news" in command:
            NEWS_API_KEY = os.getenv("NEWS_API_KEY")
            url = f"https://newsapi.org/v2/top-headlines?country=in&apiKey={NEWS_API_KEY}"
            
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                articles = data.get("articles", [])[:5]  # Get top 5 articles
                news = "\n".join([f"{i+1}. {art['title']}" for i, art in enumerate(articles)])
                return f"Top News:\n{news}"
            return "Failed to fetch news"
            
        else:
            return get_ai_response(command)
            
    except Exception as e:
        return f"Error processing command: {str(e)}"

if __name__ == "__main__":  # Corrected syntax
    speak("Welcome to my world")
    
    while True:
        try:
            with sr.Microphone() as source:
                print("Listening...")
                recognizer.adjust_for_ambient_noise(source)
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=5)
                
                command = recognizer.recognize_google(audio)
                print(f"You said: {command}")
                
                if "maya" in command.lower():
                    speak("Yes! How can I help you?")
                    audio = recognizer.listen(source, timeout=10, phrase_time_limit=5)
                    command = recognizer.recognize_google(audio)
                    
                    response = process_command(command)
                    speak(response)
                    
                elif "exit" in command.lower():
                    speak("Goodbye!")
                    break
                    
        except sr.UnknownValueError:
            print("Could not understand audio")
        except sr.RequestError as e:
            print(f"API Error: {e}")
        except Exception as e:
            print(f"Error: {e}")
