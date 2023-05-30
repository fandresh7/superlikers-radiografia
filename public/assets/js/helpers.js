const setButtonState = ({ buttonElement, disabled = false }) => {
  if (disabled) {
    buttonElement.ariaDisabled = true
    buttonElement.classList.add('disabled')
  } else {
    buttonElement.ariaDisabled = false
    buttonElement.classList.remove('disabled')
  }
}

const setErrorState = ({ errorElement, show = false, errorMessage }) => {
  if (show) {
    errorElement.classList.remove('d-none')
    errorElement.innerHTML = errorMessage
  } else {
    errorElement.classList.add('d-none')
    errorElement.innerHTML = ''
  }
}

const setDownloadState = ({ downloadElement, show = true, link }) => {
  const linkElement = downloadElement.querySelector('.stretched-link')

  if (show) {
    downloadElement.classList.remove('d-none')
    linkElement.href = link
  } else {
    downloadElement.classList.add('d-none')
  }
}

export const sendForm = async (event, path) => {
  const submitButton = event.target.querySelector('button[type="submit"]')
  const errorElement = event.target.querySelector('.error-message')
  const downloadElement = event.target.querySelector('.download')

  setButtonState({ buttonElement: submitButton, disabled: true })
  setErrorState({ errorElement, show: false })
  setDownloadState({ downloadElement, show: false })

  const formData = new FormData(event.target)

  try {
    const response = await fetch(path, {
      method: 'POST',
      body: formData
    })

    const body = await response.json()

    if (body.ok) {
      setDownloadState({ downloadElement, link: body.data })
    } else {
      const errorMessage = body?.message || body?.error || 'Ha ocurrido un error'
      setErrorState({ errorElement, show: true, errorMessage })
    }
  } catch (err) {
    setDownloadState({ downloadElement, show: false })
  } finally {
    setButtonState({ buttonElement: submitButton, disabled: false })
  }
}
