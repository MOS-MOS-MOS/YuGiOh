<template>
  <section class="section container">
    <h1 class="title">Text Image Generator</h1>
    <div class="column is-6">
      <!-- 入力フォーム -->
      <b-field
        label="テキスト"
        position="is-centered"
      >
        <b-input
          placeholder="Type Something"
          type="text"
          v-model="inputText"
        />
      </b-field>

      <!-- 文字サイズを調節するスライダー -->
      <b-field label="文字サイズ">
        <b-slider v-model="fontSize" :min="24" :max="48" :step="4" ticks rounded>
        </b-slider>
      </b-field>
    </div>

      <div id="konvaCanvas" style="margin: auto;">

        <!-- ステージを定義する -->
        <v-stage ref="stage"
        :config="{
          width: 600,
          height: 315,
        }">

          <!-- レイヤーを定義する -->
          <v-layer ref="layer">

            <!-- 画像 -->
            <v-image :config="{
              image: bgImage,
              scaleX: 0.5,
              scaleY: 0.5
            }"/>

            <!-- テキスト -->
            <v-text
            :config="{
              text: `${this.inputText}`, 
              align: 'center',
              verticalAlign: 'middle',
              offsetY: 20,
              fill: '#b0bec5',
              fontSize: fontSize,
              fontFamily: 'Helvetica',
              fontStyle: 'bold',
              lineHeight: 1.4,
              padding: 50,
              width: 600,
              height: 315,
            }"/>

          </v-layer>
        </v-stage>
      </div>
      <b-button @click="save" class="button is-primary mt-4" icon-left="download">
        画像を保存
      </b-button>

  </section>
</template>

<script>
export default {
  data() {
    return {
      bgImage: '',
      inputText: '',
      fontSize: 36
    }
  },
  created () {
    if (process.client) {
      const image = new window.Image();
      image.src = "background.png";
      image.onload = () => {
        this.bgImage = image;
      }
    }
  },
  methods: {
    save () {
      // v-stage ref="stage" の中身を JSON オブジェクトとして取得し localeStorage に格納する
      const stage = this.$refs.stage.getStage();

      // ダウンロード
      var link = document.createElement('a');
      link.download = 'image_' + this.inputText.slice(0,10).replace(/ /g, "_");
      link.href = stage.toDataURL({
        // ステージを2倍に拡大する
        pixelRatio: 2
      })
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
}
</script>
