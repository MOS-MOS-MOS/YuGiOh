<template>
  <section class="section container">
    <h1 class="title">MDルムマ画像くん（Haruki Kinoshita様のリポジトリを使用、一部改変）</h1>
    <div class="column is-6">
      <!-- 入力フォーム -->
      <a href="https://github.com/HarukiKinoshita">元コード製作者様GitHub</a><br>
      <a href="https://twitter.com/hage_urara">改変者Twitter</a>
      <b-field
        label="ルムマID"
        position="is-centered"
      >
        <b-input
          placeholder="ルームマッチIDを入力してね"
          type="text"
          v-model="inputText"
        />
      </b-field>
      
    </div>

      <div id="konvaCanvas" style="margin: auto;">

        <!-- ステージ -->
        <v-stage ref="stage"
        :config="{
          width: 600,
          height: 315,
        }">

          <!-- レイヤー -->
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
              fontSize: 60,
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
        画像を保存＆ツイート用の文章をコピペ
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
      navigator.clipboard.writeText(`ルムマID：${this.inputText}`);
    }
  },
}
</script>

<style scoped>

</style>
