<script setup lang="ts">
import { isUndef } from '@monan/shared'
import { VueDraggable } from 'vue-draggable-plus'
import { unionBy } from 'lodash-es'
import { useColumnCondition } from './ColumnCondition'
import { useSetDialog } from './setDialog'

const props = defineProps({
  buttonName: {
    type: String,
    default: '添加查询条件',
  },
  buttonType: {
    type: Number,
    default: 1,
  },
})
defineExpose({ name: 'RnConditions' })
const columnCondition = useColumnCondition()
const setDialog = useSetDialog()
const list = ref([])

function moveItemInArray(from: number, to: number) {
  const item = list.value.splice(from, 1)[0]
  list.value.splice(to, 0, item)
}

function updateHandle(event) {
  if (isUndef(event.oldIndex) || isUndef(event.newIndex)) {
    return
  }
  moveItemInArray(event.oldIndex, event.newIndex)
}
function addCondition() {
  columnCondition.use({ columns: [{ name: 'name', label: '姓名', visible: true }, { name: 'age', label: '年龄', visible: true }, { name: 'sex', label: '性别', visible: true }], save(cols) {
    const selectArry = cols.filter(v => v.visible)
    list.value = [...unionBy(list.value, selectArry, 'name')]
  } })
}
function setConfig(data) {
  setDialog.open({ type: props.buttonType, set(row) {
    console.log(row)
  } })
}
function setVisiable(data) {
  const index = list.value.findIndex(v => v.name === data.name)
  if (index > -1) {
    list.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="w-full m-auto">
    <n-button class="w-full" @click="addCondition">
      <template #icon>
        <n-icon>
          <svg
            t="1713343779201" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="2600" width="200" height="200"
          >
            <path
              d="M800 480H544V224c0-17.664-14.336-32-32-32s-32 14.336-32 32v256H224c-17.664 0-32 14.336-32 32s14.336 32 32 32h256v256c0 17.696 14.336 32 32 32s32-14.304 32-32V544h256c17.696 0 32-14.336 32-32s-14.304-32-32-32z"
              p-id="2601"
            />
          </svg>
        </n-icon>
      </template>
      {{ props.buttonName ? props.buttonName : '添加查询条件' }}
    </n-button>
    <div class="h-14px" />
    <n-scrollbar style="max-height: 290px">
      <VueDraggable
        v-model="list"
        :animation="150"
        handle=".handle"
        class="flex flex-col gap-2 w-full"
      >
        <li v-for="(element, index) in list" :key="element.name" class="flex b-1 b-solid h-32px pl-8px flex-sb_c b-#d9e2e8 w-full align--center">
          <span class="h-100% line-height-32px handle cursor-move">
            <n-icon><svg t="1713344855744" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3618" width="200" height="200"><path d="M384 768C348.653776 768 320 796.653776 320 832 320 867.346224 348.653776 896 384 896 419.346224 896 448 867.346224 448 832 448 796.653776 419.346224 768 384 768ZM384 448C348.653776 448 320 476.653776 320 512 320 547.346224 348.653776 576 384 576 419.346224 576 448 547.346224 448 512 448 476.653776 419.346224 448 384 448ZM384 128C348.653776 128 320 156.653779 320 192 320 227.346221 348.653776 256 384 256 419.346224 256 448 227.346221 448 192 448 156.653779 419.346224 128 384 128ZM640 768C604.653776 768 576 796.653776 576 832 576 867.346224 604.653776 896 640 896 675.346221 896 704 867.346224 704 832 704 796.653776 675.346221 768 640 768ZM640 448C604.653776 448 576 476.653776 576 512 576 547.346224 604.653776 576 640 576 675.346221 576 704 547.346224 704 512 704 476.653776 675.346221 448 640 448ZM640 128C604.653776 128 576 156.653779 576 192 576 227.346221 604.653776 256 640 256 675.346221 256 704 227.346221 704 192 704 156.653779 675.346221 128 640 128Z" fill="#515151" p-id="3619" /></svg></n-icon>
          </span>
          <span class="flex-auto h-100% line-height-29px pl-6px text-12px">{{ element.label }}</span>
          <span class="b-l-1px w-80px h-100% line-height-32px pl-10px">
            <n-button quaternary size="tiny" @click="setConfig(element)">
              <template #icon>
                <n-icon>
                  <svg t="1713345339093" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4704" width="200" height="200"><path d="M944.48 552.458667l-182.357333 330.666666a73.792 73.792 0 0 1-64.565334 38.325334h-362.133333a73.792 73.792 0 0 1-64.565333-38.325334l-182.357334-330.666666a75.338667 75.338667 0 0 1 0-72.682667l182.357334-330.666667a73.792 73.792 0 0 1 64.565333-38.325333h362.133333a73.792 73.792 0 0 1 64.565334 38.325333l182.357333 330.666667a75.338667 75.338667 0 0 1 0 72.682667z m-55.989333-31.146667a10.773333 10.773333 0 0 0 0-10.378667l-182.037334-330.666666a10.517333 10.517333 0 0 0-9.205333-5.482667H335.733333a10.517333 10.517333 0 0 0-9.205333 5.482667l-182.037333 330.666666a10.773333 10.773333 0 0 0 0 10.378667l182.037333 330.666667a10.517333 10.517333 0 0 0 9.205333 5.472h361.514667a10.517333 10.517333 0 0 0 9.205333-5.472l182.037334-330.666667zM513.738667 682.666667c-94.261333 0-170.666667-76.405333-170.666667-170.666667s76.405333-170.666667 170.666667-170.666667c94.250667 0 170.666667 76.405333 170.666666 170.666667s-76.416 170.666667-170.666666 170.666667z m0-64c58.912 0 106.666667-47.754667 106.666666-106.666667s-47.754667-106.666667-106.666666-106.666667-106.666667 47.754667-106.666667 106.666667 47.754667 106.666667 106.666667 106.666667z" fill="#000000" p-id="4705" /></svg>
                </n-icon>
              </template>
            </n-button>
            <n-button quaternary size="tiny" @click="setVisiable(element)">
              <template #icon>
                <n-icon>
                  <svg t="1713345396479" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5726" width="200" height="200"><path d="M909.050991 169.476903l-217.554898 0 0-31.346939c0-39.5866-32.205493-71.792093-71.793116-71.792093L408.15591 66.337871c-39.5866 0-71.792093 32.205493-71.792093 71.792093l0 31.346939L113.349581 169.476903c-11.013845 0-19.942191 8.940626-19.942191 19.954471s8.928347 19.954471 19.942191 19.954471l84.264149 0 0 640.687918c0 60.479443 49.203632 109.683075 109.683075 109.683075l416.474366 0c60.479443 0 109.683075-49.203632 109.683075-109.683075L833.454246 209.385844l75.595722 0c11.012821 0 19.942191-8.940626 19.942191-19.954471S920.063813 169.476903 909.050991 169.476903zM376.2482 138.130987c0-17.593703 14.314007-31.907711 31.907711-31.907711l211.547067 0c17.593703 0 31.907711 14.314007 31.907711 31.907711l0 31.346939L376.2482 169.477926 376.2482 138.130987zM793.569864 850.074785c0 38.486546-31.312146 69.798692-69.798692 69.798692L307.297828 919.873478c-38.486546 0-69.798692-31.312146-69.798692-69.798692L237.499136 211.042577l556.070728 0L793.569864 850.074785z" fill="#515151" p-id="5727" /><path d="M510.662539 861.276918c11.012821 0 19.954471-8.92937 19.954471-19.942191L530.61701 294.912753c0-11.013845-8.94165-19.942191-19.954471-19.942191s-19.954471 8.928347-19.954471 19.942191L490.708068 841.334727C490.708068 852.347548 499.649717 861.276918 510.662539 861.276918z" fill="#515151" p-id="5728" /><path d="M374.562814 801.449321c11.012821 0 19.954471-8.92937 19.954471-19.942191L394.517285 354.74035c0-11.013845-8.94165-19.942191-19.954471-19.942191s-19.954471 8.928347-19.954471 19.942191l0 426.76678C354.608344 792.519951 363.549993 801.449321 374.562814 801.449321z" fill="#515151" p-id="5729" /><path d="M649.832182 801.449321c11.012821 0 19.954471-8.92937 19.954471-19.942191L669.786653 354.74035c0-11.013845-8.94165-19.942191-19.954471-19.942191s-19.954471 8.928347-19.954471 19.942191l0 426.76678C629.877711 792.519951 638.81936 801.449321 649.832182 801.449321z" fill="#515151" p-id="5730" /></svg>
                </n-icon>
              </template>
            </n-button>
          </span>
        </li>
      </VueDraggable>
    </n-scrollbar>
  </div>
</template>

<style scoped>

</style>
