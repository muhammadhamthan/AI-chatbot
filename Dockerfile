#use an offical lightweight python image
FROM python:3.10-slim

#Set working directory inside the container
WORKDIR /crescentBot

#Copy requirement first (for caching)
COPY requirements.txt .

# # Copy the CPU wheel first
# COPY wheels/torch-2.8.0+cpu-cp310-cp310-manylinux_2_28_x86_64.whl .

# # Install PyTorch CPU-only
# RUN pip install --no-cache-dir torch-2.8.0+cpu-cp310-cp310-manylinux_2_28_x86_64.whl


#Install dependencies
# RUN pip install torch==2.7.1+cpu -f https://download.pytorch.org/whl/torch_stable.html
RUN pip install --no-cache-dir -r requirements.txt


#Copy the rest of the application
COPY . .

#Expose Flask port
EXPOSE 50001                          

#Run the flask app
CMD ["gunicorn","--bind","0.0.0.0:50001","main:app"]