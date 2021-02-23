// @ts-ignore
export default function ({ $axios }, inject) {
  const api = $axios.create({
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })

  api.xsrfCookieName = 'csrftoken'
  api.xsrfHeaderName = 'X-CSRFTOKEN'

  inject('api', api)
}
