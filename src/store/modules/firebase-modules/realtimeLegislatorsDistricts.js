import _ from 'lodash'

// import { mapPartyNameAbbr } from '../../../components/Election2020/utility/mappings'

const module = {
  firestorePath: '/realtime-city',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'realtimeLegislatorsDistricts',
  statePropName: 'data',
  namespaced: true, // automatically added

  // this object is your store module (will be added as '/myModule')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {
    dataPadKeys(state) {
      const data = state.data
      return _.mapKeys(data, (value, key) => {
        if (key !== 'L2' && key !== 'L3') {
          return key.padStart(3, '0')
        } else {
          return key
        }
      })
    },
    electedList(state, getters, rootState) {
      return _.transform(state.data, (result, value, key) => {
        for (let zk in value) {
          if (value[zk].isElected === "*") {
            result[`${key}-${zk}-${value[zk].no}`] = true
          }
        }
      }, {})
    },
  },
  mutations: {},
  actions: {},
}

export default module