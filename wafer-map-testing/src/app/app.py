import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def home():
    return "Flask API for Wafer Map Detection is running. Available endpoints: /hough_lines, /hough_circles"

@app.route('/hough_lines', methods=['POST'])
def hough_lines():
    data = request.json
    logging.debug(f"Received wafer map data: {data}")

    image = np.zeros((800, 800), dtype=np.uint8)
    for die in data:
        x, y, value = die["x"], die["y"], int(float(die["value"]))
        image[y, x] = value

    logging.debug(f"Image shape: {image.shape}, dtype: {image.dtype}")
    logging.debug(f"Image array:\n{image}")

    edges = cv2.Canny(image, 50, 150)
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=10, minLineLength=5, maxLineGap=5)

    line_coords = []
    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line[0]
            line_coords.append({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2})

    logging.debug(f"Detected lines: {line_coords}")
    return jsonify(line_coords)

@app.route('/hough_circles', methods=['POST'])
def hough_circles():
    data = request.json
    logging.debug(f"Received wafer map data: {data}")

    image = np.zeros((800, 800), dtype=np.uint8)
    for die in data:
        x, y, value = die["x"], die["y"], int(float(die["value"]))
        image[y, x] = value

    logging.debug(f"Image shape: {image.shape}, dtype: {image.dtype}")
    logging.debug(f"Image array:\n{image}")

    blurred_image = cv2.GaussianBlur(image, (9, 9), 2)

    circles = cv2.HoughCircles(blurred_image, cv2.HOUGH_GRADIENT, dp=1.2, minDist=20,
                               param1=50, param2=30, minRadius=5, maxRadius=30)

    circle_coords = []
    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        for (x, y, r) in circles:
            circle_coords.append({'x': int(x), 'y': int(y), 'r': int(r)})

    logging.debug(f"Detected circles: {circle_coords}")
    return jsonify(circle_coords)

if __name__ == '__main__':
    app.run(debug=True)
