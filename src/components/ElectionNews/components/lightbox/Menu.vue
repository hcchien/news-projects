<template>
  <div>
    <div v-show="lightboxSwitcher === 'left'">
      <MenuList
        v-for="(list, i) in sortedLeft"
        :key="`${i}-left`"
        :shouldShowList="i === 0"
        :list="list[1]"
      >
        <div class="head" slot="header">
          <div class="head__left">
            <img
              :src="`/proj-assets/election-news/img/sentiment-${list[0]}.svg`"
              alt=""
            >
          </div>
          <div class="head__right">
            {{ list[1].length }} {{ $t('ELECTION_NEWS.LIGHTBOX.COUNT') }}
          </div>
        </div>
      </MenuList>
    </div>
    <div v-show="lightboxSwitcher === 'right'">
      <MenuList
        v-for="(list, i) in sortedRight"
        :key="`${i}-right`"
        :shouldShowList="i === 0"
        :list="list[1]"
      >
        <div class="head" slot="header">
          <div class="head__left">
            {{ getSourceAbbr(getMediaSourceLocale(getSourceName(list[0]))) }}
          </div>
          <div class="head__right">
            {{ list[1].length }} {{ $t('ELECTION_NEWS.LIGHTBOX.COUNT') }}
          </div>
        </div>
      </MenuList>
    </div>
  </div>
</template>

<script>
import { sortBy, toPairs } from 'lodash'

import MenuList from './MenuList.vue'

import { getSourceAbbr } from '../../util'

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('ElectionNews')

import getMediaSourceLocale from 'src/components/ElectionNews/mixins/getMediaSourceLocale'

export default {
  components: {
    MenuList
  },
  mixins: [ getMediaSourceLocale ],
  computed: {
    ...mapState({
      mapping: state => state.mapping.sources,
      lightboxSwitcher: state => state.lightboxSwitcher
    }),
    ...mapGetters([
      'newscontentDataKeywordFirstFiltered',
      'newscontentDataKeywordFirstFilteredGroupBySentiment'
    ]),
    sortedLeft () {
      const order = [ 'good', 'normal', 'bad' ]
      const _toPairs = toPairs(this.newscontentDataKeywordFirstFilteredGroupBySentiment)
      const _sortBy = sortBy(_toPairs, d => order.indexOf(d[0]))
      _sortBy.forEach(d => { d[1] = sortBy(d[1], d => -d.s) })
      return _sortBy
    },
    sortedRight () {
      const _toPairs = toPairs(this.newscontentDataKeywordFirstFiltered)
      const _sortBy = sortBy(_toPairs, d => -d[1].length)
      _sortBy.forEach(d => { d[1] = sortBy(d[1], d => -d.s) })
      return _sortBy
    },
  },
  methods: {
    getSourceName (sourceId) {
      return this.mapping[sourceId]
    },
    getSourceAbbr (source) {
      return getSourceAbbr(this.$store, source)
    }
  }
}
</script>

<style lang="stylus" scoped>
.head
  display flex
  justify-content center
  align-items center
  width 100%
  &__left
    img
      height 30px
  &__right
    margin 0 0 0 10px

@media (min-width 1024px)
  .head
    &__right
      font-size 20px
</style>