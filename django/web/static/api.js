const requestHeader = () => {
  return {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken')
    }
  }
};
const requestHeaderWithNullData = () => {
  return {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken')
    },
    data: {}
  }
};

const HOST = '';
const FORCE_SCRIPT_NAME = '/kusatsu';

const PREFIX = HOST + FORCE_SCRIPT_NAME;

const get = (path) => {
  return axios.get(PREFIX + path, requestHeaderWithNullData(),
    {
      withCredentials: true
    })
    .then((response) => Promise.resolve(response))
    .catch((error) => Promise.reject(error));
}

const post = (path, request) => {
  return axios.post(PREFIX + path, request, requestHeader())
    .then((response) => Promise.resolve(
    ))
    .catch((error) => Promise.reject(error));
}

const patch = (path, request) => {
  return axios.patch(PREFIX + path, request, requestHeader())
    .then((response) => Promise.resolve(
    ))
    .catch((error) => Promise.reject(error));
}

const form = (path, request) => {
  let formData = new FormData();
  for (var key in request) {
    formData.append(key, request[key]);
  };
  let config = {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'content-type': 'multipart/form-data'
    }
  };
  return axios.post(PREFIX + path, formData, config)
    .then((response) => Promise.resolve(
    ))
    .catch((error) => Promise.reject(error));
}

export { get, post, form, patch };
