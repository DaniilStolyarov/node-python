import keras
import matplotlib.pyplot as plt
import numpy as np
from keras.datasets import mnist
import cv2


add_path = './py-script'

model = keras.models.load_model(add_path + '/model')

filename = add_path + './image.png'

while True:
    incoming_message = input()
    if incoming_message != 'predict image':
        continue

    img = cv2.imread(filename, 0)

    img= cv2.bitwise_not(img) / 255.0

   
    result = model.predict(np.array([img]), verbose=0)
    answer = np.argmax(result)

    print(answer)
    

