import sys

sys.path.append("..")  # Add the parent directory to the Python path

from app.gmail import Gmail, get_body, get_headers

gmail = Gmail()

print(f"Logged in as: {gmail.address}")

message_id = gmail.list_new_message_ids()
message = gmail.get_message(message_id)
headers = get_headers(message)
print(headers["from"], "|", headers["subject"])
print(get_body(message)[:500])  # print first 500 characters of the email body

gmail.send_reply(
    message, "This is a test reply from the AI Customer Support application."
)
print("Sent reply to:", headers["from"])
