from dotenv import load_dotenv
from pydantic_ai import Agent

load_dotenv()

agent = Agent("groq:openai/gpt-oss-20b")

result = agent.run_sync("Reply with exactly: Groq connection works!")

print(result.output)
