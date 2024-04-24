import {defineModal} from '@runafe/magic-system'
import RsColumn from './column.vue'
import type {Column} from '@runafe/unified-api-designer'
export function useColumnDialog() {
  const modal = defineModal({
    width: 800,
  })

  function open(options: {
    row: Column,
    set: (row: Column) => void
  }) {
    const columnRef=ref<InstanceType<typeof RsColumn>>()
    function submitHandle(){
      columnRef.value.submitHandle()
    }
    modal.load({
      title: () => '表格列设置',
      default: () => (<RsColumn ref={columnRef} {...options} onClose={()=>{ modal.close()}}/>),
      footer: () => [
        <n-button
          onClick={() => {
            modal.close()
          }}
        >
          关 闭
        </n-button>,
        <n-button type="primary" onClick={submitHandle}>
          确 定
        </n-button>,
      ],
    }).open()
  }

  return {
    open
  }
}
