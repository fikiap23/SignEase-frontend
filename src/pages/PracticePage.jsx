import React, { useState, useRef } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
import { Button, FeedbackMessage } from '../components'
import { useParams } from 'react-router-dom'
import { useCurrentPractice } from '../hooks/UseCurrentPractice'
import Loading from '../components/Loading'
import auth from '../utils/auth'
import ApiClient from '../lib/api/ApiClient'
import { useAudio } from 'react-use'
import correctSound from '../assets/correct.wav'
import incorrectSound from '../assets/incorrect.wav'

const PracticePage = () => {
  const [currPracticeIndex, setcurrPracticeIndex] = useState(0)
  const [capturedImage, setCapturedImage] = useState(null)
  const [feedbackStatus, setFeedbackStatus] = useState(null)
  const [feedbackAnswer, setFeedbackAnswer] = useState('')
  const [xpPoints, setXpPoints] = useState(0)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const webcamRef = useRef(null)
  const [correctAudio, _c, correctControls] = useAudio({ src: correctSound })
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: incorrectSound,
  })

  const { slug, unit } = useParams()
  const {
    data: practices,
    error: errorPractice,
    isFetching: isFetchingPractice,
    refetch: refetchPractice,
  } = useCurrentPractice(unit)

  const currPractice = practices[currPracticeIndex]

  const captureAndSubmit = async () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)

    const formData = new FormData()
    formData.append('slugPractice', unit)
    formData.append('numberPractice', currPractice.number)
    formData.append('file', dataURItoBlob(imageSrc), 'capture.jpg')

    const token = auth.getToken()

    ApiClient.post('/practice/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        correctControls.play()
        setXpPoints(res.data.data.point)
        setFeedbackStatus('correct')
        setFeedbackAnswer("Congratulations! You're right.")
      })
      .catch((err) => {
        incorrectControls.play()
        const result = err.response.data
        setFeedbackStatus('incorrect')
        setFeedbackAnswer(result.message)
      })

    setShowFeedbackModal(true)
  }

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1])
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }

  const handleNextGesture = () => {
    if (currPracticeIndex < practices.length - 1) {
      setcurrPracticeIndex(currPracticeIndex + 1)
      setCapturedImage(null)
      setFeedbackStatus(null)
      setFeedbackAnswer('')
    }
  }

  const handlePreviousGesture = () => {
    if (currPracticeIndex > 0) {
      setcurrPracticeIndex(currPracticeIndex - 1)
      setCapturedImage(null)
      setFeedbackStatus(null)
      setFeedbackAnswer('')
    }
  }

  const toggleFeedbackModal = () => {
    setShowFeedbackModal(!showFeedbackModal)
  }

  return (
    <>
      {correctAudio}
      {incorrectAudio}
      {isFetchingPractice && (
        <section className="w-full min-h-screen p-4 md:p-8 flex justify-center items-center">
          <Loading />
        </section>
      )}
      {!isFetchingPractice && !practices && (
        <section className="w-full min-h-screen p-4 md:p-8 flex justify-center items-center">
          <h1 className="text-2xl font-bold">No lessons found.</h1>
        </section>
      )}

      {!isFetchingPractice && practices && (
        <section className="w-full min-h-screen p-4 md:p-8">
          {/* Page Heading */}
          <h1 className="text-2xl font-bold mb-8">Practice Sign Language</h1>

          {/* Gesture Image and question */}
          <div className="mb-8 max-w-lg mx-auto">
            <img
              src={currPractice.imageUrl}
              alt={currPractice.question}
              className="w-full rounded-lg mb-4"
            />
            <p className="text-lg text-center">{currPractice.question}</p>
          </div>

          {/* Divider */}
          <hr className="my-8" />

          {/* Webcam */}
          <div className="mb-8 w-full max-w-lg mx-auto">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg"
              width="100%"
            />
            <div className="flex items-center justify-center mt-2">
              <Button
                type="button"
                btnStyle="text-white bg-green-500 hover:bg-blue-700 px-4 py-2 rounded"
                onClick={captureAndSubmit}
                title="Capture"
              />
            </div>
          </div>

          {/* Feedback Modal */}
          {showFeedbackModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <FeedbackMessage
                  questionState={feedbackStatus}
                  message={feedbackAnswer}
                  xpPoints={xpPoints}
                />
                <Button
                  type="button"
                  btnStyle="text-white bg-green-500 hover:bg-blue-700 px-4 py-2 rounded mt-4"
                  onClick={toggleFeedbackModal}
                  title="Close"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mb-8">
            <Button
              type="button"
              btnStyle={`text-white bg-gray-500 hover:bg-gray-700 px-4 py-2 rounded ${
                currPracticeIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handlePreviousGesture}
              disabled={currPracticeIndex === 0}
              title="Previous"
            />
            <Button
              type="button"
              btnStyle={`text-white bg-gray-500 hover:bg-gray-700 px-4 py-2 rounded ${
                currPracticeIndex === practices.length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={handleNextGesture}
              disabled={currPracticeIndex === practices.length - 1}
              title="Next"
            />
          </div>
        </section>
      )}
    </>
  )
}

export default PracticePage
