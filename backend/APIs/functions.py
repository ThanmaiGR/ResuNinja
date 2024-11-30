import json
import fitz
import google.generativeai as genai
from dotenv import load_dotenv
import os


def jsonify(text):
    """
    Converts a string to a JSON object.
    :param text: String to convert.
    :return: JSON object.
    """
    response_text = text[7:-4]  # Or `response.content` if it's a raw response object
    # print(response_text)
    try:
        # Convert JSON string to a Python dictionary
        response_dict = json.loads(response_text)
        print(response_dict)
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)


class LLM:
    """
    Class for the Language Model.
    Attributes:
        model_name (str): Name of the LLM model to use.
        flash (GenerativeModel): GenerativeModel object.
    """
    def __init__(self, model_name):
        """
        Initializes the LLM model.
        :param model_name: Name of the model to use.
        """

        load_dotenv()
        self.model_name = model_name
        genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
        self.flash = genai.GenerativeModel(model_name)

    def extract_text_from_pdf(pdf_path):
        """
        Extracts text from a PDF file.
        :param pdf_path: Path to the PDF file.
        :return: Extracted text.
        """
        doc = fitz.open(pdf_path)
        text = ""
        for page_num in range(doc.page_count):
            page = doc.load_page(page_num)
            text += page.get_text()  # Extracts text from the page
        doc.close()
        return text

    def parse_resume(self, text):
        """
        Parses a resume and extracts the following information:
        - Certifications
        - Work Experience
        - Skills
        - Projects
        :param text: Text of the resume.
        :return: JSON object containing the extracted information.
        """
        prompt = f"""Parse the given resume and return valid JSON format, ensuring proper syntax
        Extract only Certifications, Work Experience, Skills and Projects.
        {text}
        """
        return self.flash.generate_content(prompt)

    def generate_questionnaire(self, skill):
        """
        Generates a questionnaire for a given skill.
        :param skill: Skill for which to generate the questionnaire.
        :return: Generated questionnaire.
        """
        prompt = f''' Generate 5 questions for the {skill}.
        The questions should be of a rating from 1 to 5, 1 being lowest and 5 being highest difficulty. Do not generate any other text
        Question:
        Rating:
        '''
        return self.flash.generate_content(prompt)

    def generate_feedback(self, questions, answers):
        """
        Generates feedback for a set of questions and answers.
        :param questions: List of questions.
        :param answers: List of answers.
        :return: Generated feedback.
        """
        feed = self.flash.generate_content(f"""
        Evaluate the answers for the given questions and generate a brief descriptive feedback as well as a quantitative feedback.
        Quantitative must be on a scale of 1-5 for the following: Knowledge of Skill, Explanation, Approach, Intuition
        Feedback must not be question specific but specific points on topics may be mentioned in descriptive
        Questions:{questions}
        Answers:{answers}
        Descriptive FeedBack:
        """)

