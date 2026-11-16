from app.ai.agent import support_agent
from app.ai.schemas import AgentReply

prompt = """
Section picked by the classifier: paddle-boards

Customer email:
Hi, my paddle board has a slow leak.
What should I do?
"""

result = support_agent.run_sync(prompt)

print("\n========== GROQ AGENT TEST ==========")

print("Output type:", type(result.output))

print("\nStructured response:")
print(result.output.model_dump_json(indent=2))

print("\nIs AgentReply:", isinstance(result.output, AgentReply))
