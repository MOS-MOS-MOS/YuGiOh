<template>
  <div>
    <div class="flex flex-wrap">
      <button @click="applyBold" class="button">
        Bold
      </button>
      <button @click="applyItalic" class="button">
        Italic
      </button>
      <button @click="applyHeading" class="button">
        <font-awesome-icon :icon="['fas', 'heading']" />
      </button>
      <button @click="applyUl" class="button">
        <font-awesome-icon :icon="['fas', 'list-ul']" />
      </button>
      <button @click="applyOl" class="button">
        <font-awesome-icon :icon="['fas', 'list-ol']" />
      </button>
      <button @click="undo" class="button">
        <font-awesome-icon :icon="['fas', 'undo']" />
      </button>
      <button @click="redo" class="button">
        <font-awesome-icon :icon="['fas', 'redo']" />
      </button>
    </div>

    <div
      @input="onInput"
      v-html="innerValue"
      contenteditable="true"
      class="wysiwyg-output outline-none border-2 p-4 rounded-lg border-gray-300 focus:border-green-300"
    />
  </div>
</template>

<script>
// import { Marked } from '@ts-stack/markdown'
// import TurndownService from 'turndown'
import hljs from 'highlight.js';

export default {
  name: 'WysiwygEditor',

  data() {
    return {
      // innerValue: Marked.parse(this.value) || '<p><br></p>'
    }
  },

  mounted() {
    document.execCommand('defaultParagraphSeparator', false, 'p')
  },

  methods: {
    onInput(event) {
      // const turndown = new TurndownService({
      //   emDelimiter: '_',
      //   linkStyle: 'inlined',
      //   headingStyle: 'atx'
      // })
      // this.$emit('input', turndown.turndown(event.target.innerHTML))
      this.$emit('input', hljs.highlightAuto(event.target.innerHTML))
    },
    applyBold() {
      document.execCommand('bold')
    },
    applyItalic() {
      document.execCommand('italic')
    },
    applyHeading() {
      document.execCommand('formatBlock', false, '<h1>')
    },
    applyUl() {
      document.execCommand('insertUnorderedList')
    },
    applyOl() {
      document.execCommand('insertOrderedList')
    },
    undo() {
      document.execCommand('undo')
    },
    redo() {
      document.execCommand('redo')
    }
  }
}
</script>
