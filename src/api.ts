const API_BASE_URL = 'http://localhost:5000/api/quiz';

// TypeScript Interfaces to match your backend data structure
export interface Module {
  title: string;
  description: string;
  estimatedTime: string;
  objectives: string[];
}

export interface Curriculum {
  topic: string;
  modules: Module[];
}

export interface GenerationPayload {
  userId: string;
  topic: string;
  learningStyle: string;
  answers: string[];
}

/**
 * 🚀 Generates a fresh AI curriculum roadmap via OpenRouter 
 * and automatically links it to the user profile in MongoDB.
 */
export const generateCurriculum = async (payload: GenerationPayload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error: any) {
    console.error("Error generating curriculum:", error);
    return { success: false, message: error.message };
  }
};

/**
 * 🔄 Retrieves the saved AI curriculum path from the database 
 * for a persistent profile view (Perfect for page reloads during judge demos!).
 */
export const fetchCurriculum = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/curriculum/${userId}`);
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching curriculum:", error);
    return { success: false, message: error.message };
  }
};