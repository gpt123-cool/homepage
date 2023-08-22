import { createI18n } from 'vue-i18n'

const userLanguage = navigator.language || navigator.userLanguage

const messages = {
  'en-US': {
    input: {
      placeholder: 'Say something...'
    },
    button: {
      send: 'Send'
    }
  },
  'zh-CN': {
    input: {
      placeholder: '说点啥...'
    },
    button: {
      send: '发送'
    }
  }
}

export default createI18n({
  locale: userLanguage,
  fallbackLocale: 'en-US',
  messages
})