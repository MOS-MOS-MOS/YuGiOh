<template>
  <div class="">
    <div class="p-6">
      <div class="mb-6 has-text-centered">
        <Logo class="mb-2" style="width:200px;" />
        <p class="has-text-centered is-family-mono" style="color: #BDCCD4;">Generate editor-like images with your source code. </p>
      </div>
      <div class="columns is-mobile is-multiline is-flex-direction-row-reverse is-variable is-8 mb-5">
        <div class="column is-7-tablet is-6-desktop">
          <div class="block">
            <b-field grouped>
              <b-field label="Width" class="pr-6" expanded>
                <b-slider v-model="wrapperWidth" indicator :custom-formatter="(val) => Math.round(val*1.5).toString()" :tooltip="false" size="is-medium" :min="480" :max="960"></b-slider>
              </b-field>
              <b-field label="Height" class="pr-6" expanded>
                <b-slider v-model="wrapperHeight" indicator :custom-formatter="(val) => Math.round(val*1.5).toString()" :tooltip="false" size="is-medium" :min="240" :max="540"></b-slider>
              </b-field>
            </b-field>
            <b-field>
              <b-switch v-model="isAspectFixed">16:9</b-switch>
            </b-field>
          </div>
          <div class="block">
            <b-field grouped>
              <b-field label="Watermark" class="mr-6">
                <b-switch v-model="hasWatermark"></b-switch>
              </b-field>
              <b-field label="File Name" class="mr-6" expanded>
                <b-input type="text" placeholder="sample.js" v-model="inputFileName">
                </b-input>
              </b-field>
              <!-- <b-field>
                <b-switch v-model="hasMacwindow">Header</b-switch>
              </b-field> -->
            </b-field>
          </div>
        </div>
        <div class="column is-5-tablet is-6-desktop is-12-mobile">
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
      <div class="is-flex is-justify-content-center mb-5" style="width: 95%; margin: auto;">
        <div id="wrapper" :style="{ width: wrapperWidth + 'px', height: wrapperHeight + 'px' }">
          <div id="preview" class="hljs" :style="{ width: wrapperWidth - 80 + 'px', height: wrapperHeight - 45 + 'px'}">
            <div id="editor" v-html="highlightedText.value"></div>
            <div id="macwindow" v-show="hasMacwindow">
              <MacWindow />
            </div>
            <div id="filename" v-show="inputFileName">
              {{ inputFileName }}
            </div>
            <div id="watermark" v-show="hasWatermark">
              <Logo />
            </div>
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
      <p class="control has-text-centered mb-6">
        <b-button label="Export" @click="save" class="button is-primary has-text-weight-bold" icon-left="download" />
      </p>
      <b-modal v-model="showMessage">
        <div class="notification has-text-centered">
          <p class="mb-4">Wait a moment</p>
          <p class="is-size-3 mb-4">Share <strong>Sauce</strong> with your friends!</p>
          <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="Try Sauce!" data-url="https://nuxt-text-image-generator.vercel.app/sauce" data-related="" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        </div>
      </b-modal>
  </div>
</template>

<script>
import hljs from 'highlight.js';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import Logo from '~/assets/syntax/logo.svg'
import MacWindow from '~/assets/syntax/macwindow.svg'
// const languages = require('@/data/languages.json');

export default {
  components: {
    Logo, MacWindow
  },
  data() {
    return {
      inputText: "import Vue from 'vue'",
      wrapperWidth: 800,
      wrapperHeight: 450,
      isAspectFixed: true,
      languages: [],
      name: '',
      selected: null,
      outputfilename: '',
      hasWatermark: true,
      hasMacwindow: true,
      inputFileName: '',
      showMessage: false
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
      var node = document.getElementById('wrapper');
      if (window.navigator.userAgent.toLowerCase().match(/iPhone|Android.+Mobile/)){
        this.$buefy.notification.open({
          message: 'Long press to save the image.',
          type: 'is-light',
          position: 'is-bottom-right'
        })
        htmlToImage.toPng(node, {pixelRatio: 1.5})
          .then(function (dataUrl){
            var img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
          })
      } else {
        this.showMessage = true;
        htmlToImage.toPng(node, { pixelRatio: 1.5 })
          .then(function (dataUrl) {
            var img = new Image();
            var link = document.createElement('a');
            link.download = "sauce_output";
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.removeChild(link);
          })
      }
    }
  },
}
</script>



<style>
@import url('highlightjs/styles/atom-one-light.css');

html {
  background-color: #374151;
  overflow-x: hidden !important;
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
input[type="text"]
{
  background: transparent;
  color: #eee;
}
#preview {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  padding: 60px 30px 30px 30px;
  font-family: 'Menlo', 'Source Code Pro', monospace !important;
  border-radius: 10px;
  filter: drop-shadow(0 0.5rem 1rem #171717);
  white-space: pre-wrap;
  overflow-y: hidden;
}
#binput {
  padding: 60px 30px 30px 30px;
  height: 100% !important;
  background: transparent;
  font-family: 'Menlo', 'Source Code Pro', monospace !important;
  border: none;
  resize: none;
  color: transparent;
  caret-color: gray;
  overflow-y: hidden;
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
#watermark {
  position: absolute;
  right: 32px;
  bottom: 24px;
  width: 96px;
  opacity: 0.75;
}
#filename {
  position: absolute;
  right: 32px;
  top: -4px;
}
#macwindow {
  position: absolute;
  left: 30px;
  top: 24px;
  width: 72px;
}
</style>