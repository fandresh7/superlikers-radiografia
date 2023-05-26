const form = document.querySelector('#form')
const button = document.querySelector('#form button')
const loadingText = button.querySelector('.loading')
const sendText = button.querySelector('.send')
const inputFile = form.querySelector('input')

const linkElement = document.querySelector('.download')
const anchorElement = linkElement.querySelector('a')
const messageElement = document.querySelector('.error-message')

const buttonState = (disabled = false) => {
  if (disabled) {
    button.ariaDisabled = true
    loadingText.classList.remove('d-none')
    sendText.classList.add('d-none')
  } else {
    button.ariaDisabled = false
    loadingText.classList.add('d-none')
    sendText.classList.remove('d-none')
  }
}

const sendForm = async (formData) => {
  buttonState(true)

  try {
    const response = await fetch('/entries', {
      method: 'POST',
      body: formData
    })

    const body = await response.json()

    if (body.ok) {
      linkElement.classList.remove('d-none')
      anchorElement.href = body.data
    } else {
      messageElement.classList.remove('d-none')
      messageElement.innerText = body?.message || body?.error || 'Ha ocurrido un error'
    }
  } catch (err) {
    messageElement.classList.remove('d-none')
  }

  buttonState(false)
}

inputFile.addEventListener('change', () => {
  linkElement.classList.add('d-none')
  messageElement.classList.add('d-none')
  buttonState(false)
})

form.addEventListener('submit', event => {
  event.preventDefault()

  const fileInput = form.querySelector('input[type="file"]')
  const file = fileInput.files[0]

  const formData = new FormData(event.target)
  formData.append('file', file)

  sendForm(formData)
})
