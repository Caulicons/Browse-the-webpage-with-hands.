
export default class HandGestureService {
  #gestureEstimate
  #handPoseDetection
  #handsVersion
  #detector = null
  #gestureStrings
  constructor({ fingerPose, handPoseDetection, handsVersion, knownGestures, gestureStrings }) {
  
    this.#gestureEstimate = new fingerPose.GestureEstimator(knownGestures);
    this.#handPoseDetection = handPoseDetection;
    this.#handsVersion = handsVersion;
    this.#gestureStrings = gestureStrings;
  } 

  async initializeDetector() {
    if (this.#detector) return this.#detector

    const detectorConfig = {
      runtime: 'mediapipe', // or 'tfjs',
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
      modelType: 'lite',
      maxHands: 2
    }

    this.#detector = await this.#handPoseDetection.createDetector(
      this.#handPoseDetection.SupportedModels.MediaPipeHands, detectorConfig
    );

    return this.#detector
  }

  async estimateHands(video) {
    return await this.#detector.estimateHands(video, {
      flipHorizontal: true
    });
  }

  async estimate(keyPoints3D) {

    const predictions = await this.#gestureEstimate.estimate(
      await this.#landMarksFromKeyPoints(keyPoints3D),
      // score percentage of 9%
      9
    )

    return predictions.gestures
  }

  async * detectorGesture(predictions) {

    for (const hand of predictions) {
      if (!hand.keypoints3D || !hand.keypoints3D.length) continue

      const catchGesture = await this.estimate(hand.keypoints3D)

      if (!catchGesture.length) continue

      const gesture = catchGesture.reduce(
        ((previous, current) => (previous.score > current.score) ? previous : current)
      )

      const { x, y } = hand.keypoints.find(keyPoint => 
          keyPoint.name === 'index_finger_tip'
        )

        console.log('Detector Gesture', this.#gestureStrings[gesture.name]);

      yield { event: gesture.name, x, y}
    }
  }

  async #landMarksFromKeyPoints(keyPoints3D) {

    return await keyPoints3D.map(keyPoint => [
      keyPoint.x, keyPoint.y, keyPoint.z
    ])
  }
}