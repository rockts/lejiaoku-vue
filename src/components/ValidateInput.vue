<template>
  <div class="validate-input-container pb-3">
    <input
      type="text"
      class="form-control"
      v-model="inputRef.val"
      :class="{ 'is-invalid': inputRef.error }"
      @blur="validateInput"
    />

    <span v-if="inputRef.error" class="invalid-feedback">
      {{ inputRef.message }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from 'vue';
// eslint-disable-next-line no-useless-escape
const emailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
interface RuleProp {
  type: 'required' | 'email';
  message: string;
}
export type RulesProp = RuleProp[];
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
  },
  setup(props) {
    const inputRef = reactive({
      val: '',
      error: false,
      message: '',
    });
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true;
          inputRef.message = rule.message;
          switch (rule.type) {
            case 'required':
              passed = inputRef.val.trim() !== '';
              break;
            case 'email':
              passed = emailReg.test(inputRef.val);
              break;
            default:
              break;
          }
          return passed;
        });
        inputRef.error = !allPassed;
      }
    };
    return {
      inputRef,
      validateInput,
    };
  },
});
</script>
