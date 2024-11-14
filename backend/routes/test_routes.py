import re
from datetime import datetime, timedelta
import email
import imaplib
from email.header import decode_header
from urllib.parse import urlparse
import requests
from flask import Blueprint, jsonify, request

test_routes = Blueprint('test_routes', __name__)

def connect_to_gmail(imap_server, email_address, password):
    mail = imaplib.IMAP4_SSL(imap_server)
    mail.login(email_address, password)
    return mail

def search_emails(mail, mailbox, search_criteria, num_emails=4):
    _, messages = mail.search(None, search_criteria)
    email_ids = messages[0].split()[-num_emails:]
    return email_ids

def fetch_and_parse_emails(mail, email_ids, link_pattern, failures_pattern):
    email_data_list = []

    for email_id in email_ids:
        _, msg_data = mail.fetch(email_id, "(RFC822)")
        email_data = msg_data[0][1]
        msg = email.message_from_bytes(email_data)
        subject, encoding = decode_header(msg["Subject"])[0]
        if isinstance(subject, bytes):
            subject = subject.decode(encoding if encoding is not None else "utf-8")

        email_info = {
            "subject": subject,
            "build": subject.split("#")[1].split(" ")[1],
            "link": "",
            "date": "",
            "number_of_failures": "",
        }

        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                payload = part.get_payload(decode=True)
                payload_str = payload.decode(part.get_content_charset() or "utf-8")
                link_match = link_pattern.search(payload_str)
                failures_match = failures_pattern.search(payload_str)

                if link_match:
                    link = link_match.group(1)
                    email_info["link"] = link
                    date_time_str = link.split("/")[-3] + " " + link.split("/")[-2]
                    date_time_obj = datetime.strptime(date_time_str, "%Y-%m-%d %H-%M")
                    email_info["date"] = date_time_obj
                if failures_match:
                    num_failures = failures_match.group(1)
                    email_info["number_of_failures"] = num_failures

        email_data_list.append(email_info)

    return email_data_list

class Test:
    def __init__(self, name, number):
        self.name = name
        self.number = number
        self.content = ""

    def __eq__(self, other):
        return self.name == other.name and self.content == other.content

    def to_dict(self):
        return {
            "name": self.name,
            "number": self.number,
            "content": self.content
        }

def get_tests_from_file(test_file_url):
    print(f"Downloading {test_file_url}...")
    response = requests.head(test_file_url)
    test_file_size = int(response.headers.get("Content-Length", 0))
    begin_range = int(test_file_size * 1.9)
    headers = {"Range": f"bytes={begin_range}-{test_file_size}"}
    response = requests.get(test_file_url, headers=headers)

    test_file_buffer = ""
    tests = []
    test_name_regex = r"\s\s[0-9]+\)"
    write_to_buffer = False

    first_char = ""
    for line in response.iter_lines(decode_unicode=True):
        if len(line) == 0:
            first_char = ""
        else:
            first_char = line[0]

        if write_to_buffer and re.match(r"[A-Za-z]", first_char):
            write_to_buffer = False

        if "Failures:" in line:
            write_to_buffer = True

        if write_to_buffer:
            test_file_buffer += line
            test_file_buffer += "\n"

            if re.match(test_name_regex, line):
                test_name_tmp = line.split(")")
                tests.append(Test(test_name_tmp[1].strip(), test_name_tmp[0].strip()))
            else:
                if len(tests) > 0:
                    tests[-1].content += line + "\n"

    parsed_url = urlparse(test_file_url)
    file_path = "./" + parsed_url.path[1:].replace("/", "_")
    with open(file_path, "w") as file:
        file.write(test_file_buffer)

    return tests

@test_routes.route("/fetch-data", methods=["GET"])
def fetch_data():
    imap_server = request.args.get("imap_server")
    email_address = request.args.get("email_address")
    password = request.args.get("password")
    mailbox = "inbox"
    search_criteria = f'(SUBJECT "{request.args.get("project")}")'

    link_pattern = re.compile(
        r"Rspec Report\s*<\s*(http://s3.amazonaws.com/golfgenius-dev/coverage/\S+)>",
        re.IGNORECASE,
    )

    failures_pattern = re.compile(r"(\d+) failures", re.IGNORECASE)

    mail = connect_to_gmail(imap_server, email_address, password)
    mail.select(mailbox)

    email_ids = search_emails(mail, mailbox, search_criteria, num_emails=20)
    email_data_list = fetch_and_parse_emails(mail, email_ids, link_pattern, failures_pattern)

    mail.logout()

    response = []

    for index, email_info in enumerate(email_data_list, start=1):
        if email_info["date"]:
            romania_timezone_offset = (
                3 if email_info["date"].month > 3 and email_info["date"].month < 10 else 2
            )
            date_time_obj_romania = email_info["date"] + timedelta(hours=romania_timezone_offset)
            day_of_week = date_time_obj_romania.strftime("%A")
            
            if day_of_week in ("Saturday",):
                continue

            response.append({
                "build": email_info["build"],
                "subject": email_info["subject"],
                "link": email_info["link"],
                "number_of_failures": email_info["number_of_failures"],
                "date": email_info["date"],
            })

    return {"data": response}

@test_routes.route("/get_test_diff", methods=["GET"])
def get_test_diff():
    file_1_url = request.args.get("file_1")
    file_2_url = request.args.get("file_2")

    file_1_tests = get_tests_from_file(file_1_url)
    file_2_tests = get_tests_from_file(file_2_url)

    diff = [test for test in file_2_tests if test not in file_1_tests]
    response = []
    for test in diff:
        response.append({
            "number": test.number,
            "name": test.name,
            "content": test.content
        })

    return response

@test_routes.route("/get_test", methods=["GET"])
def get_test():
    file_url = request.args.get("file")
    file_tests = get_tests_from_file(file_url)
    file_tests_dict = [test.to_dict() for test in file_tests]
    return jsonify(file_tests_dict)
