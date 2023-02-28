const form = document.querySelector('#form')

const sendForm = async (formData) => {
  const response = await fetch('/', {
    method: 'POST',
    body: formData
  })

  const body = await response.json()
  
  if(body.ok) {
    const linkElement = document.querySelector('.download')
    linkElement.classList.remove('d-none')
    linkElement.href = body.data
  } else {
    const messageElement = document.querySelector('.message')
    messageElement.innerText = 'Ha ocurrido un error'
  }
}

form.addEventListener('submit', event => {
  event.preventDefault()

  const fileInput = form.querySelector('input[type="file"]');
  const file = fileInput.files[0];
  const formData = new FormData();

  formData.append('file', file);
  sendForm(formData)
})
