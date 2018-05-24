<template>
  <div class="box">
    <input type="file" ref="uploadInput" id="input" @change="handleFileSelection">
    <div class="alertbox" v-if="error">
      <p>{{ errorMsg }}</p>
    </div>
    <div class="level">
      <pre class="preview">
        {{ fileContents }}
      </pre>
    </div>
    <div class="level-right">
      <button class="level-item button" @click="$emit('hideUploadWidget')">
          <span>Cancel</span>
      </button>
      <button class="level-item button is-info" @click="doUpload">
          <span>OK</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: false,
      errorMsg: '',
      uploadedFile: null,
      fileContents: '', 
    }
  },
  methods: {
    handleFileSelection() {
      this.fileContents = ''; //reset
      const files = this.$refs.uploadInput.files;
      const selectedFile = files[0];
      const filenametest = selectedFile.name.toLowerCase();
      //filetype
      if( (selectedFile.type !== 'application/json') || 
          !filenametest.endsWith('.json')
        ) {
        this.errorMsg = "Sorry! You can only upload a .json file!";
        this.error = true;
        return;
      }
      //file size
      if(selectedFile.size >= 512000) {
        this.errorMsg = "Your dataset is too big! We only process files of up to 500 Kb in size.";
        this.error = true;
        return;
      }

      //check json file (ideally, validate against a schema)
      //... TODO ...

      //process the file
      const filereader = new FileReader();
      var scope = this;
      filereader.onload = function(evt){
        scope.fileContents = evt.target.result;
      }

      //this.uploadedFile = selectedFile;
      this.errorMsg = '';
      this.error = false;
      filereader.readAsText(selectedFile); //2nd arg defaults to 'UTF-8'
    },
    doUpload() {
      const jsonObj = JSON.parse(this.fileContents);
      this.$emit('uploadReady', jsonObj);
    }
  }
}
</script>

<style scoped>
.alertbox {
  color: #ff3860;
  margin:0.5rem 0;
}
pre.preview {
  max-height: 200px;
  width: 100%;
  margin: 1rem 0;
  padding: 0;
  /* overflow: hidden; */
}
</style>
