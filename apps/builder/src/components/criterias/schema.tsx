export const conditionSchema = [
  {
    $el: 'div',
    attrs: {
      ref: '$animationEl',
    },
    children: [
      {
        $formkit: 'list',
        name: 'singleCriterias',
        label: '筛选条件',
        dynamic: true,
        children: [
          {
            $el: 'div',
            attrs: {
              class: 'flex-s_s_nw gap-x-12px',
              key: '$item',
            },
            for: [
              'item',
              'index',
              '$items',
            ],
            children: [
              {
                $formkit: 'group',
                index: '$index',
                id: '$: item + $index',
                children: [
                  {
                    $formkit: 'n:button',
                    class: 'm-t-5px',
                    size: 'tiny',
                    key: 'button',
                    n_type: 'primary',
                    children: '$index + 1',
                  },
                  {
                    $formkit: 'n:select',
                    class: 'w-150px',
                    name: 'fieldName',
                    label: '条件',
                    valueField: 'name',
                    key: 'fieldName',
                    options: '$options',
                    placeholder: '请选择',
                    id: '$conditionValue.id + fieldName +$index',
                    onBlur: '$clear($index)',
                    validation: 'required',
                    clearable: false,
                  },
                  {
                    $formkit: 'n:select',
                    class: 'w-100px',
                    key: 'matcher',
                    id: '$conditionValue.id + matcher +$index',
                    name: 'matcher',
                    options: '$meta($index,matcherOptions)',
                    validation: 'required',
                    label: '逻辑符号',
                    clearable: false,
                    placeholder: '请选择',
                  },
                  {
                    $formkit: 'n:dyn',
                    class: 'w-252px!',
                    key: 'values',
                    name: 'values',
                    id: '$conditionValue.id + values +$index',
                    maxlength: 100,
                    validation: {
                      if: '$meta($index, validation)',
                      then: '$meta($index, validation)',
                      else: '',
                    },
                    validationRules: {
                      if: '$meta($index, validationRules)',
                      then: '$meta($index, validationRules)',
                      else: '',
                    },
                    validationMessages: {
                      if: '$meta($index, validationMessages)',
                      then: '$meta($index, validationMessages)',
                      else: '',
                    },
                    dyn_props_getter: {
                      if: '$createPropsGetter($index)',
                      then: '$createPropsGetter($index)',
                      else: '',
                    },
                    dyn_trait: '$dynTrait($index)',
                    dyn_key: '$meta($index, value) + _ + values',
                    dyn_traits: {
                      select: {
                        tag: false,
                        options: '$meta($index, valueOptions)',
                        valueField: '$valueField',
                        labelField: '$labelField',
                      },
                      date: {
                        'value-format': 'yyyy-MM-dd',
                      },
                      tags: {
                        'dyn_input': 'select',
                        'valueField': '$valueField',
                        'labelField': '$labelField',
                        'multiple': true,
                        'tag': true,
                        'show-arrow': false,
                        'show': false,
                        'renderTag': '$renderTag',
                        'onPatternBlur': '$onPatternBlurCreator($index)',
                      },
                      range: {
                        dyn_input: 'text',
                        pair: true,
                        separator: '-',
                        label: '',
                      },
                      radio: {
                        options: [
                          { label: '是', value: true },
                          { label: '否', value: false },
                        ],
                      },
                    },
                  },
                  {
                    $formkit: 'n:button',
                    if: '$dynTrait($index) === tags',
                    n_type: 'tertiary',
                    secondary: true,
                    class: 'h-32px px-10px p-b-6px relative left--42px',
                    onClick: '$batchAddCreator($index)',
                    children: '...',
                  },
                  {
                    $formkit: 'n:button',
                    class: {
                      if: '$dynTrait($index) === tags',
                      then: 'relative left--42px h-14px w-14px flex-c_c cursor-pointer m-t-8px ',
                      else: 'h-14px w-14px flex-c_c cursor-pointer m-t-8px ',
                    },
                    disabled: '$conditionValue.disabled && $conditionValue.singleCriterias.length===1 && $conditionValue.boolCriterias.length===0 ',
                    n_type: 'warning',
                    circle: true,
                    onClick: '$remove($index)',
                    children: '-',
                  },

                ],
              },
            ],
          },

        ],
      },

    ],
  },

]
