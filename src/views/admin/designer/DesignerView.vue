<template>
    <bpmn-modeler
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="false"
      @save="save"
    />
</template>

<script>
import bpmnModeler from 'workflow-bpmn-modeler'

export default {
  name: 'DesignerView',
  components: {
    bpmnModeler
  },
  data () {
    return {
      xml: '', // Query the xml
      users: [
        {
          name: 'The Beatles',
          id: '1'
        },
        {
          name: 'The Rolling Stones',
          id: '2'
        },
        {
          name: 'Pink Floyed',
          id: '3'
        }
      ],
      groups: [
        {
          name: 'Folk Music',
          id: '4'
        },
        {
          name: 'Rock Music',
          id: '5'
        },
        {
          name: 'Classical Music',
          id: '6'
        }
      ],
      categorys: [
        {
          name: 'Music',
          id: '7'
        },
        {
          name: 'Articles',
          id: '8'
        }
      ]
    }
  },
  methods: {
    getModelDetail () {
      // Send request to get xml
      // this.xml = response.xml
    },
    save (data) {
      console.log(data)
      // { process: {...}, xml: '...', svg: '...' }
    }
  }
}
</script>
<style>
.flow-containers .djs-palette {
  left: 0px !important;
  top: 0px;
  border: 1px solid rgba(199, 197, 197, 0.32);
  width: 130px !important;
  margin: 10px 20px;
  border-radius: 10px !important;
}

.is-vertical .el-aside {
  background: rgb(240, 240, 240) !important;
  margin-top: 5px;
  border-radius: 10px !important;
}

.flow-containers {
  background-image: linear-gradient(90deg, rgba(60, 10, 30, .04) 3%, transparent 0), linear-gradient(1turn, rgba(60, 10, 30, .04) 3%, transparent 0);
  background-size: 20px 20px;
  background-position: 50%;
  background-repeat: repeat;
}

.is-vertical .el-header{
  background: rgb(253, 253, 253) !important;
}
</style>
