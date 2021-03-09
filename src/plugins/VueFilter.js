import moment from 'moment'
class VueFilter {}

VueFilter.install = function(Vue, options) {
  Vue.mixin({
    methods: {
      formatTime(date, type = 'YYYY-MM-DD HH:mm:ss') {
        return moment(date).format(type)
      },
    },
  })

  Vue.filter('timeFilter', function(value, type = 'YYYY-MM-DD HH:mm:ss') {
    return moment(value).format(type)
  })
}

export default VueFilter
