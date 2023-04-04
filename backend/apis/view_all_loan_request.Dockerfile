FROM python:3-slim
WORKDIR /usr/src/app
COPY http.reqs.txt ./
RUN python -m pip install --no-cache-dir -r http.reqs.txt
COPY ./view_all_loan_request.py ./functions.py  ./getProductTypes.py ./getCustomerTypes.py ./
CMD [ "python", "./view_all_loan_request.py" ]