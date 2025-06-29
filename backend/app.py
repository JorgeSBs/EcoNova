# Import necessary libraries
from flask import Flask, request, jsonify
from flask_cors import CORS # To handle Cross-Origin Resource Sharing
import requests
import os
import logging # Import for logging

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes, allowing frontend to make requests
CORS(app)

# --- Configuration ---
# It's HIGHLY recommended to get your API key from environment variables
# For local testing, you can uncomment and set it directly, but NEVER for production
# GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"
# Make sure to replace "YOUR_GEMINI_API_KEY_HERE" with your actual Gemini API key.
# For production, set this as an environment variable (e.g., in your hosting environment)
# Reemplaza "AIzaSyA5E550wyM510Kuv78s5Ihv9qS1S3ViOaY" con tu clave real
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyA5E550wyM510Kuv78s5Ihv9qS1S3ViOaY")

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Configuración básica de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Diccionario para rastrear la primera interacción por cada CHAT_ID
# Usamos una combinación de user_id y chat_id para sesiones más robustas
chat_session_active = {}

# --- Backend Endpoint for Gemini API Calls ---
@app.route('/generate_content', methods=['POST'])
def generate_content():
    """
    Handles POST requests from the frontend to interact with the Gemini API.
    Receives user message and optional image data, makes the Gemini API call,
    and returns the response.
    """
    try:
        data = request.get_json()
        user_message = data.get('user_message', '')
        image_data = data.get('image_data', None) # Contains mimeType and data (base64)
        user_id = data.get('user_id', 'anonymous')
        chat_id = data.get('chat_id', 'default_chat') # ¡NUEVO! Recibe el chat_id

        logging.info(f"Received request for user_id: {user_id}, chat_id: {chat_id}")
        logging.info(f"User message: {user_message[:50]}...") # Log first 50 chars of message
        if image_data:
            logging.info("Image data received.")

        # Determinar si es la primera interacción de este CHAT_ID
        # Usa una clave combinada para la sesión de chat (user_id_chat_id)
        session_key = f"{user_id}_{chat_id}"
        is_first_interaction = chat_session_active.get(session_key, True)
        logging.info(f"Is first interaction for session_key {session_key}: {is_first_interaction}")

        # Prompt base para el comportamiento del chatbot
        base_prompt = """
        Eres un Eco-Chatbot experto en reciclaje, reutilización y reparación.
        Tu propósito es educar y guiar a los usuarios sobre cómo manejar adecuadamente los materiales para proteger el medio ambiente.

        **Reglas estrictas:**
        1. **Solo responde sobre reciclaje, reutilización, reparación, sostenibilidad y temas relacionados con la ecología.**
        2. **Si la pregunta del usuario no tiene relación con estos temas, responde amablemente que tu función está limitada a la ecología y el reciclaje, y que no puedes ayudar con ese tema específico.**
        3. **Formatea tus respuestas de manera organizada, utilizando saltos de línea, y si es necesario, listas o puntos clave para facilitar la lectura, tambien puedes utilizar emojis para una informacion más atractiva.**
        4. **Mantén tus respuestas concisas y claras.**
        """

        # Construct prompt parts for Gemini API
        prompt_parts = []
        prompt_parts.append({"text": base_prompt})

        if image_data:
            # If an image is provided, add it to the prompt parts
            prompt_parts.append({
                "inlineData": {
                    "mimeType": image_data["mimeType"],
                    "data": image_data["data"]
                }
            })
            # Add an initial instruction for image description if an image is present
            prompt_parts.append({
                "text": "Describe los objetos en esta imagen que podrían ser reciclados, reutilizados o reparados. Concéntrate en los materiales y formas. Luego, ofrece sugerencias específicas sobre cómo reciclar, reutilizar o reparar cada elemento identificado. Si el usuario hace una pregunta, enfócate en cómo los materiales de la imagen se relacionan con el reciclaje, la reutilización o la reparación."
            })

        if user_message:
            # Add the user's text message to the prompt parts
            prompt_parts.append({"text": user_message})

        # Ensure there's content to send to Gemini
        if not prompt_parts:
            logging.warning("No content provided for Gemini API.")
            return jsonify({"error": "No content provided for Gemini API."}), 400

        # Prepare the payload for the Gemini API request
        gemini_payload = {
            "contents": [{"role": "user", "parts": prompt_parts}],
        }
        logging.info("Sending request to Gemini API.")

        # Make the request to the Gemini API
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers={"Content-Type": "application/json"},
            json=gemini_payload
        )
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)

        gemini_result = response.json()
        logging.info("Received response from Gemini API.")

        # Extract the text response from Gemini
        gemini_response_text = ""
        if gemini_result.get("candidates") and len(gemini_result["candidates"]) > 0:
            if gemini_result["candidates"][0].get("content") and \
               gemini_result["candidates"][0]["content"].get("parts") and \
               len(gemini_result["candidates"][0]["content"]["parts"]) > 0:
                gemini_response_text = gemini_result["candidates"][0]["content"]["parts"][0].get("text", "")
        else:
            logging.warning("No candidates found in Gemini response.")
            if gemini_result.get("promptFeedback") and gemini_result["promptFeedback"].get("blockReason"):
                block_reason = gemini_result["promptFeedback"]["blockReason"]
                gemini_response_text = f"Lo siento, tu solicitud fue bloqueada por el modelo debido a: {block_reason}. Por favor, reformula tu pregunta o asegúrate de que esté relacionada con reciclaje y ecología."
            else:
                gemini_response_text = "Lo siento, no pude generar una respuesta en este momento. Por favor, intenta de nuevo o reformula tu pregunta."


        # If it's the first interaction for this specific chat (not just user), add action buttons
        if is_first_interaction:
            gemini_response_text += "\n\n¿Qué te gustaría hacer? Puedes elegir una de estas opciones:"
            gemini_response_text += "\n- Reciclar"
            gemini_response_text += "\n- Reutilizar"
            gemini_response_text += "\n- Reparar"
            chat_session_active[session_key] = False # Mark as interacted for this specific chat

        # Return Gemini's response to the frontend
        return jsonify({"gemini_response": gemini_response_text})

    except requests.exceptions.RequestException as e:
        # Handle errors related to the HTTP request to Gemini API
        app.logger.error(f"Error communicating with Gemini API: {e}")
        return jsonify({"error": f"Error del servidor al comunicarse con la API de Gemini: {e}"}), 500
    except Exception as e:
        # Handle any other unexpected errors
        app.logger.error(f"An unexpected error occurred: {e}")
        return jsonify({"error": f"Error interno del servidor: {e}"}), 500

# Run the Flask app
if __name__ == '__main__':
    # Ensure the API key is set before running
    if GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE" and not os.environ.get("GEMINI_API_KEY"):
        print("ADVERTENCIA: La clave de API de Gemini no está configurada. Por favor, establece la variable de entorno GEMINI_API_KEY o edita el archivo app.py.")
        print("La aplicación podría no funcionar correctamente sin una clave de API válida.")
    # Usar host='0.0.0.0' para que sea accesible desde otras máquinas en la red (útil para pruebas)
    app.run(debug=True, host='0.0.0.0', port=5000) # Run in debug mode for development (reloads on changes)