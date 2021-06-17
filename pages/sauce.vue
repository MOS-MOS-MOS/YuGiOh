<template>
  <div>
    <div class="container section">
      <div class="mb-6 has-text-centered">
        <Logo class="mb-2" style="width:200px;" />
        <p class="has-text-centered is-family-mono" style="color: #BDCCD4;">Generate editor-like images with your souce code. </p>
      </div>
      <div class="columns is-mobile is-multiline is-flex-direction-row-reverse is-variable is-8 mb-5">
        <div class="column is-3-tablet is-6-mobile">
          <b-field label="Height">
            <b-slider v-model="wrapperHeight" indicator :custom-formatter="(val) => Math.round(val*1.5).toString()" :tooltip="false" size="is-medium" :min="240" :max="540"></b-slider>
          </b-field>
        </div>
        <div class="column is-3-tablet is-6-mobile">
          <b-field label="Width" class="pb-1">
            <b-slider v-model="wrapperWidth" indicator :custom-formatter="(val) => Math.round(val*1.5).toString()" :tooltip="false" size="is-medium" :min="480" :max="960"></b-slider>
          </b-field>
          <b-field>
            <b-checkbox v-model="isAspectFixed">16:9</b-checkbox>
          </b-field>
        </div>
        <div class="column is-6-tablet is-12-mobile">
          <b-field label="Language" class="pb-2">
            <b-autocomplete
              v-model="name"
              :data="filteredDataArray"
              placeholder="e.g. python, cpp"
              clearable
              @select="option => selected = option">
              <template #empty>No languages found</template>
            </b-autocomplete>
          </b-field>
          <div style="height: 2rem;">
            <span v-if="selected" class="tag is-primary has-text-weight-bold is-medium">{{ selected }}</span>
            <span v-else-if="highlightedText.language" class="tag is-primary has-text-weight-bold is-medium">{{ highlightedText.language }} <span class="has-text-weight-normal">&nbsp;(detected)</span></span>
          </div>
        </div>
      </div>
    </div>

      <!-- <highlightjs autodetect :code="inputText" /> -->
      <!-- <pre class=""><code v-highlight="inputText" class="autodetect" id="editor"></code></pre> -->
      <div class="is-flex is-justify-content-center mb-5">
        <div id="wrapper" :style="{ width: wrapperWidth + 'px', height: wrapperHeight + 'px' }">
          <div id="preview" class="hljs" :style="{ width: wrapperWidth - 80 + 'px', height: wrapperHeight - 45 + 'px'}">
            <div id="editor" v-html="highlightedText.value"></div>
            <!-- <div class="has-text-right">
              <Logo />
            </div> -->
          </div>
          <b-field
            id="bfield"
            position="is-centered"
          >
            <b-input :style="{ width: wrapperWidth + 'px', height: wrapperHeight + 'px'}"
              data-gramm_editor="false"
              id="binput"
              type="textarea"
              v-model="inputText"
            />
          </b-field>
        </div>
      </div>


      <b-field grouped position="is-centered">
        <!-- <b-input type="text" v-modal="outputfilename" placeholder="filename">
        </b-input> -->
        <p class="control">
          <b-button @click="save" class="button is-primary has-text-weight-bold" icon-left="download">
            Export
          </b-button>
        </p>
      </b-field>

  </div>
</template>

<script>
import hljs from 'highlight.js';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import Logo from '~/assets/syntax/logo.svg'
// const languages = require('@/data/languages.json');

export default {
  components: {
    Logo
  },
  data() {
    return {
      inputText: "import Vue from 'vue'",
      wrapperWidth: 800,
      wrapperHeight: 450,
      isAspectFixed: false,
      languages: [],
      name: '',
      selected: null,
      outputfilename: ''
    }
  },
  mounted: function() {
    this.languages = hljs.listLanguages();
    // console.log(this.languages);
    document.getElementById('binput').spellcheck = false;
  },
  computed: {
    highlightedText: function() {
      // if (this.selectedLang) {
      //   return hljs.highlight(this.selectedLang, this.inputText.value)
      // }
      // console.log(hljs.highlightAuto(this.inputText).value);
        return hljs.highlightAuto(this.inputText);
    },
    filteredDataArray() {
      return this.languages.filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .indexOf(this.name.toLowerCase()) >= 0
      })
    }
  },
  watch: {
    wrapperHeight: function() {
      if (this.isAspectFixed) {
        this.wrapperWidth = Math.round(this.wrapperHeight * 16 / 9);
      }
    },
    wrapperWidth: function() {
      if (this.isAspectFixed) {
        this.wrapperHeight = Math.round(this.wrapperWidth * 9 / 16);
      }
    }
  },
  methods: {
    save () {
      this.$buefy.notification.open({
        message: 'Exporting. It may take a few seconds. ',
        type: 'is-light',
        position: 'is-bottom-right',
      })
      var node = document.getElementById('wrapper');
      htmlToImage.toPng(node, { pixelRatio: 1.5 })
        .then(function (dataUrl) {
          // var link = document.createElement('a');
          // link.download = 'my-image-name.jpeg';
          // link.href = dataUrl;
          // link.click();

          var img = new Image();
          img.src = dataUrl;
          window.open(img.src);

          // document.body.appendChild(img);
          // var link = document.createElement('a');
          // link.download = "output";
          // link.href = img.src;
          // document.body.appendChild(link);
          // link.click();
          // document.removeChild(link);
        })
    }
  },
}
</script>


<style src='highlightjs/styles/atom-one-dark.css'></style>

<style>
html {
  background-color: #374151;
}
label {
  color: #eee !important;
}
#wrapper {
  padding: 22.5px 40px;
  background-color: #374151;
  position: relative;
}
.is-family-mono {
  font-family: 'Menlo', 'Source Code Pro', monospace !important;
}
#preview {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  padding: 30px;
  font-family: 'Menlo', 'Source Code Pro', monospace !important;
  border-radius: 10px;
  filter: drop-shadow(0 0.5rem 1rem #171717);
  white-space: pre-wrap;
}
#binput {
  padding: 30px;
  height: 100% !important;
  background: transparent;
  font-family: 'Menlo', 'Source Code Pro', monospace !important;
  border: none;
  resize: none;
  color: transparent;
  caret-color: white;
}
#binput:focus {
  /* border-radius: 10px; */
  /* outline: 0px !important; */
  box-shadow: none;
  -webkit-box-shadow: none;
}
#bfield {
  width: calc(100% - 80px);
  height: calc(100% - 45px);
}
#preview, #bfield {
  position: absolute;
  top: 22.5px;
  left: 40px;
}
</style>