import tensorflow as tf
import numpy as np
from os.path import join, dirname

IMG_WIDTH = 28
IMG_HEIGHT = 28
NUM_LABELS = 10
EPOCHS = 3


def getModel():
    # initialize model
    model = tf.keras.models.Sequential([
        tf.keras.layers.Conv2D(
            32, (5, 5), activation="relu", input_shape=(IMG_WIDTH, IMG_HEIGHT, 1)
        ),
        tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),
        tf.keras.layers.Conv2D(
            64, (5, 5), activation="relu", input_shape=(IMG_WIDTH, IMG_HEIGHT, 1)
        ),
        tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(7 * 7 * 64, activation="relu"),
        tf.keras.layers.Dense(1024, activation="relu"),
        tf.keras.layers.Dropout(0.5),

        # output layer corresponding to all 10 categories
        tf.keras.layers.Dense(NUM_LABELS, activation="softmax")
    ])

    # compile model
    model.compile(
        optimizer="SGD",
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )

    return model


def getTrainedModel():
    (trainX, trainY), (testX, testY) = tf.keras.datasets.mnist.load_data()

    print(trainX.shape)

    trainY, testY = (tf.one_hot(trainY, NUM_LABELS),
                     tf.one_hot(testY, NUM_LABELS))

    trainX, testX = trainX / 255, testX / 255

    trainX = np.expand_dims(trainX, axis=-1)
    testX = np.expand_dims(testX, axis=-1)

    model = getModel()
    model.fit(trainX, trainY, epochs=EPOCHS)
    model.evaluate(testX, testY, verbose=2)
    return model


def packModel():
    p = join(dirname(__file__), "build/1")
    model = getTrainedModel()

    tf.keras.models.save_model(
        model,
        p,
        overwrite=True,
        include_optimizer=True,
        save_format=None,
        signatures=None,
        options=None
    )


if __name__ == "__main__":
    packModel()
