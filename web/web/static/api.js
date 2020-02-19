const requestHeader = () => {
  return {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'sessionid': Cookies.get('sessionid')
    }
  }
};
const requestHeaderWithNullData = () => {
  return {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'sessionid': Cookies.get('sessionid')
    },
    data: {}
  }
};

const HOST = '';

const get = (path) => {
  return axios.get(HOST + path, requestHeaderWithNullData(),
    {
      withCredentials: true
    })
    .then((response) => Promise.resolve(response))
    .catch((error) => Promise.reject(error));
}

const post = (path, request) => {
  return axios.post(HOST + path, request, requestHeader())
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
  return axios.post(HOST + path, formData, config)
    .then((response) => Promise.resolve(
      console.log(response)
    ))
    .catch((error) => Promise.reject(error));
}

export { get, post, form };
