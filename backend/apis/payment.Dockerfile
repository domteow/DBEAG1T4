FROM python:3-slim
WORKDIR /usr/src/app
COPY http.reqs.txt ./
RUN python -m pip install --no-cache-dir -r http.reqs.txt
COPY ./payment.py ./invokes_tbank.py ./
CMD [ "python", "./payment.py" ]