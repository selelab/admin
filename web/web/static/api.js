const requestHeader = {
  headers: {
    'X-CSRFToken': Cookies.get('csrftoken'),
    'sessionid': Cookies.get('sessionid')
  }
};
const requestHeaderWithNullData = {
  headers: {
    'X-CSRFToken': Cookies.get('csrftoken'),
    'sessionid': Cookies.get('sessionid')
  },
  data: {}
};

const HOST = '';

const get = (path) => {
  return axios.get(HOST + path, requestHeaderWithNullData,
    {
      withCredentials: true
    })
    .then((response) => Promise.resolve(response))
    .catch((error) => Promise.reject(error));
}

const post = (path, request) => {
  return axios.post(HOST + path, request, requestHeader,
    {
      withCredentials: true
    })
    .then((response) => Promise.resolve(
      response
    ))
    .catch((error) => Promise.reject(error));
}

export { get, post };
