FROM tensorflow/serving

COPY build /models/digit-recognition

COPY serve-tf.sh /usr/bin/serve-tf.sh
RUN chmod +x /usr/bin/serve-tf.sh
ENTRYPOINT []
CMD ["/usr/bin/serve-tf.sh"]