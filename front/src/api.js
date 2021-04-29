import Axios from 'axios'

Axios.defaults.xsrfHeaderName = 'X-CSRFToken'
Axios.defaults.xsrfCookieName = 'csrftoken'


const getBaseURL = (host) => {
  if (host === 'selelab.com') {
    return 'https://api.selelab.com'
  } else {
    return ''
  }
}

const api = Axios.create({
  baseURL: `${getBaseURL(location.host)}/api/admin`,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
})

export default api;
