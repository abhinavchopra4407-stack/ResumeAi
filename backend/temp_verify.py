import requests

url = 'http://127.0.0.1:8002/api/v1/resumes'
with open('README.md', 'rb') as f:
    files = {'file': ('README.md', f, 'text/plain')}
    resp = requests.post(url, files=files, timeout=60)
print('status', resp.status_code)
print(resp.text)
