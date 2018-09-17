const TOKEN_KEY = 'jwtToken'
const USER_INFO = 'userInfo'

const auth = {

  clear(key) {
    if (localStorage && localStorage.getItem(key)) {
      return localStorage.removeItem(key)
    }

    if (sessionStorage && sessionStorage.getItem(key)) {
      return sessionStorage.removeItem(key)
    }

    return null
  },

  clearAppStorage() {
    if (localStorage) {
      localStorage.clear()
    }

    if (sessionStorage) {
      sessionStorage.clear()
    }
  },

  clearToken(tokenKey = TOKEN_KEY) {
    return auth.clear(tokenKey)
  },

  clearUserInfo(userInfo = USER_INFO) {
    return auth.clear(userInfo)
  },

  get(key) {
    if (localStorage && localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key)) || null
    }

    if (sessionStorage && sessionStorage.getItem(key)) {
      return JSON.parse(sessionStorage.getItem(key)) || null
    }

    return null
  },

  getToken(tokenKey = TOKEN_KEY) {
    return auth.get(tokenKey)
  },

  getUserInfo(userInfo = USER_INFO) {
    return auth.get(userInfo)
  },

  set(value, key, isLocalStorage) {
    if (!value || value.length === 0) {
      return null
    }

    if (isLocalStorage && localStorage) {
      return localStorage.setItem(key, JSON.stringify(value))
    }

    if (sessionStorage) {
      return sessionStorage.setItem(key, JSON.stringify(value))
    }

    return null
  },

  setToken(value = '', isLocalStorage = false, tokenKey = TOKEN_KEY) {
    return auth.set(value, tokenKey, isLocalStorage)
  },

  setUserInfo(value = '', isLocalStorage = false, userInfo = USER_INFO) {
    return auth.set(value, userInfo, isLocalStorage)
  },
}

export default auth
