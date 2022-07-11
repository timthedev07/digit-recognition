import tf from "@tensorflow/tfjs";

export const getModel = () => {
  return tf.sequential({
    layers: [
      // tf.conv2d
    ],
  });
};

export const saveModel = (model: tf.Sequential) => {
  model.save("file://.");
};

saveModel(getModel());
