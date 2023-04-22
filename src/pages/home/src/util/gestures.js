const { GestureDescription, Finger, FingerCurl, FingerDirection } = window.fp

const scrollDown = new GestureDescription('scrollDown'); // ✊️
const scrollUp = new GestureDescription('scrollUp'); // 🖐
const scissorsGesture = new GestureDescription('scissorsGesture'); // ✌️
const defeat = new GestureDescription('Defeat'); // 👎
const ClickGesture = new GestureDescription('click'); // 🤏🏼

// Rock
// -----------------------------------------------------------------------------

// thumb: half curled
// accept no curl with a bit lower confidence
scrollDown.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
/* ScrollDown.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.9); */

// all other fingers: curled
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  scrollDown.addCurl(finger, FingerCurl.FullCurl, 1.0);
  scrollDown.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// Paper
// -----------------------------------------------------------------------------

// no finger should be curled
for (let finger of Finger.all) {
  scrollUp.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// Scissors
//------------------------------------------------------------------------------

// index and middle finger: stretched out
scissorsGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
scissorsGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

// ring: curled
scissorsGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
scissorsGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// pinky: curled
scissorsGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
scissorsGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

// thumb: curled
scissorsGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
scissorsGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);

// Gesture Defeat 
//------------------------------------------------------------------------------

// Thumb
defeat.addCurl(Finger.Thumb, FingerCurl.NoCurl);
defeat.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 1.0);

defeat.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.9);
defeat.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.9);

// do this for all other fingers
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  defeat.addCurl(finger, FingerCurl.FullCurl, 1.0);
  defeat.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// Click 
//------------------------------------------------------------------------------

ClickGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8)
ClickGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 0.5)

ClickGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
ClickGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.4)

ClickGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.9)

ClickGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.9)

ClickGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.9)

const knownGestures = [
  scrollDown, scrollUp, scissorsGesture, defeat, ClickGesture
]

const gestureStrings = {
  scrollDown: '✊️',
  scrollUp: '🖐',
  scissorsGesture: '✌️',
  defeat: '👎',
  click: '🤏🏼'
}

export {
  knownGestures,
  gestureStrings
}