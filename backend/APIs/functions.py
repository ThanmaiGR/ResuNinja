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
        return response_dict
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
        Projects must be split into title, tech_stack, and description.
        {text}
        """
        return self.flash.generate_content(prompt).text

    def generate_questionnaire(self, skill):
        """
        Generates a questionnaire for a given skill.
        :param skill: Skill for which to generate the questionnaire.
        :return: Generated questionnaire.
        """
        prompt = f''' Generate 5 questions for the {skill}. Return valid JSON format, ensuring proper syntax.
        The questions should be of a rating from 1 to 5, 1 being lowest and 5 being highest difficulty. Do not generate any other text
        Question:
        Rating:
        '''
        return self.flash.generate_content(prompt).text
    
    def generate_project_questionnaire(self, projectName, tech_stack, description):
        """
        Generates a questionnaire for a project.
        :param projectName: Name of the project.
        :param tech_stack: Technologies used in the project.
        :param description: Description of the project.
        :return: Generated questionnaire.
        """
        prompt = f''' Generate 5 questions for the project:{projectName}. The Project uses technologies like {tech_stack} and has the following description: {description}.
        Generate the questions like you would for a technical interview. If there is no tech_stack or description, ask questions regarding tech stack used and project description.
        Return valid JSON format, ensuring proper syntax.
        The questions should be of a rating from 1 to 5, 1 being lowest and 5 being highest difficulty. Do not generate any other text
        Question:
        Rating:
        '''
        return self.flash.generate_content(prompt).text

    def generate_feedback(self, questions, answers):
        """
        Generates feedback for a set of questions and answers.
        :param questions: List of questions.
        :param answers: List of answers.
        :return: Generated feedback.
        """
        feed = self.flash.generate_content(f"""Return valid JSON format, ensuring proper syntax.
        Evaluate the answers for the given questions and generate feedback.

        Feedback must focus on the user’s ability to express their thoughts clearly and effectively, with a focus on technical accuracy and problem-solving abilities.
        Provide specific examples where the user can improve or where they excel, to help them better prepare for real-world interview scenarios.
        Questions: {questions}
        Answers: {answers}
        The feedback should be as a whole, not individual feedback for each question.
        Format:
        descriptive: string
        quantitative: dictionary
        
        
        Do not include any other text in the response.
        Quantitative must be on a scale of 1-10 for the following:
        1. Technical Proficiency
        2. Critical Thinking & Problem-Solving
        3. Clarity & Expression
        4. Practical Application & Relevance
        5. Depth of Explanation
        """)

        return feed.text

    def generate_overall_feedback(self, feedback):
        """
        Generates overall feedback for a set of feedbacks.
        :param feedback: List of feedbacks.
        :return: Generated overall feedback.
        """
        return self.flash.generate_content(f""" Return valid JSON format, ensuring proper syntax.
        Generate an overall feedback for the given feedbacks in the same format with no extra content.
        Feedbacks:{feedback}
        Format:
        general_feedback: string
        strengths: []
        recommendations: []
        """).text
