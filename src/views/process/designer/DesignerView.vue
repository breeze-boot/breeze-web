<template>
  <el-container class="designer">
    <bpmn-modeler
      ref="bpmDesigner"
      :categorys="categorys"
      :groups="groups"
      :is-view="false"
      :users="users"
      :xml="xml"
      @save="save"
    />
  </el-container>
</template>

<script>
import bpmnModeler from 'workflow-bpmn-modeler'
import { deploy, getProcessDefinitionXml, getVersionProcessDefinitionXml } from '@/api/process/definition'

export default {
  name: 'DesignerView',
  components: {
    bpmnModeler
  },
  data () {
    return {
      processKey: '',
      tenantId: '',
      processDefinitionId: '',
      xml: '',
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
  created () {
    // eslint-disable-next-line no-template-curly-in-string
    this.xml = '<?xml version="1.0" encoding="UTF-8"?>\\n<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:flowable="http://flowable.org/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.flowable.org/processdef">\\n  <process id="holiday001" name="holiday" flowable:processCategory="8">\\n    <startEvent id="startNode1" name="开始">\\n      <outgoing>Flow_0k5g6iy</outgoing>\\n    </startEvent>\\n    <userTask id="Activity_0m9kfnp" flowable:assignee="3">\\n      <incoming>Flow_0k5g6iy</incoming>\\n      <outgoing>Flow_1yee174</outgoing>\\n    </userTask>\\n    <sequenceFlow id="Flow_0k5g6iy" sourceRef="startNode1" targetRef="Activity_0m9kfnp" />\\n    <serviceTask id="Activity_1xcycgo" flowable:class="com.breeze.boot.flowable.callable.CallExternalSystemDelegate">\\n      <incoming>Flow_0bnb40e</incoming>\\n      <outgoing>Flow_0hm6psg</outgoing>\\n    </serviceTask>\\n    <exclusiveGateway id="Gateway_0y14fyl">\\n      <incoming>Flow_1yee174</incoming>\\n      <outgoing>Flow_0bnb40e</outgoing>\\n      <outgoing>Flow_0svom0r</outgoing>\\n    </exclusiveGateway>\\n    <sequenceFlow id="Flow_1yee174" sourceRef="Activity_0m9kfnp" targetRef="Gateway_0y14fyl" />\\n    <sequenceFlow id="Flow_0bnb40e" name="同意" sourceRef="Gateway_0y14fyl" targetRef="Activity_1xcycgo">\\n      <conditionExpression xsi:type="tFormalExpression">${approved}</conditionExpression>\\n    </sequenceFlow>\\n    <sequenceFlow id="Flow_0svom0r" name="拒绝" sourceRef="Gateway_0y14fyl" targetRef="Activity_1k8uks7">\\n      <conditionExpression xsi:type="tFormalExpression">${!approved}</conditionExpression>\\n    </sequenceFlow>\\n    <serviceTask id="Activity_1k8uks7" flowable:class="com.breeze.boot.flowable.callable.SendRejectionMail">\\n      <incoming>Flow_0svom0r</incoming>\\n      <outgoing>Flow_0nt3skk</outgoing>\\n    </serviceTask>\\n    <sequenceFlow id="Flow_0hm6psg" sourceRef="Activity_1xcycgo" targetRef="Activity_1d8tyg9" />\\n    <endEvent id="Event_0uzbald" name="结束">\\n      <incoming>Flow_1q3gzyv</incoming>\\n    </endEvent>\\n    <sequenceFlow id="Flow_1q3gzyv" sourceRef="Activity_1d8tyg9" targetRef="Event_0uzbald" />\\n    <userTask id="Activity_1d8tyg9" name="假期审批" flowable:assignee="2">\\n      <incoming>Flow_0hm6psg</incoming>\\n      <outgoing>Flow_1q3gzyv</outgoing>\\n    </userTask>\\n    <endEvent id="Event_0lgoel3" name="结束">\\n      <incoming>Flow_0nt3skk</incoming>\\n    </endEvent>\\n    <sequenceFlow id="Flow_0nt3skk" sourceRef="Activity_1k8uks7" targetRef="Event_0lgoel3" />\\n  </process>\\n  <bpmndi:BPMNDiagram id="BPMNDiagram_flow">\\n    <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="holiday001">\\n      <bpmndi:BPMNEdge id="Flow_0nt3skk_di" bpmnElement="Flow_0nt3skk">\\n        <di:waypoint x="500" y="250" />\\n        <di:waypoint x="642" y="250" />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id="Flow_1q3gzyv_di" bpmnElement="Flow_1q3gzyv">\\n        <di:waypoint x="700" y="140" />\\n        <di:waypoint x="802" y="140" />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id="Flow_0hm6psg_di" bpmnElement="Flow_0hm6psg">\\n        <di:waypoint x="500" y="140" />\\n        <di:waypoint x="600" y="140" />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id="Flow_0svom0r_di" bpmnElement="Flow_0svom0r">\\n        <di:waypoint x="240" y="165" />\\n        <di:waypoint x="240" y="250" />\\n        <di:waypoint x="400" y="250" />\\n        <bpmndi:BPMNLabel>\\n          <omgdc:Bounds x="244" y="205" width="22" height="14" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id="Flow_0bnb40e_di" bpmnElement="Flow_0bnb40e">\\n        <di:waypoint x="265" y="140" />\\n        <di:waypoint x="400" y="140" />\\n        <bpmndi:BPMNLabel>\\n          <omgdc:Bounds x="321" y="122" width="23" height="14" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id="Flow_1yee174_di" bpmnElement="Flow_1yee174">\\n        <di:waypoint x="120" y="140" />\\n        <di:waypoint x="215" y="140" />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id="Flow_0k5g6iy_di" bpmnElement="Flow_0k5g6iy">\\n        <di:waypoint x="-65" y="140" />\\n        <di:waypoint x="20" y="140" />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id="BPMNShape_startNode1" bpmnElement="startNode1" bioc:stroke="">\\n        <omgdc:Bounds x="-95" y="125" width="30" height="30" />\\n        <bpmndi:BPMNLabel>\\n          <omgdc:Bounds x="-92" y="162" width="22" height="14" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id="Activity_00p5085_di" bpmnElement="Activity_0m9kfnp">\\n        <omgdc:Bounds x="20" y="100" width="100" height="80" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id="Activity_113nume_di" bpmnElement="Activity_1xcycgo">\\n        <omgdc:Bounds x="400" y="100" width="100" height="80" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id="Gateway_0y14fyl_di" bpmnElement="Gateway_0y14fyl" isMarkerVisible="true">\\n        <omgdc:Bounds x="215" y="115" width="50" height="50" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id="Activity_0ltz7ne_di" bpmnElement="Activity_1k8uks7">\\n        <omgdc:Bounds x="400" y="210" width="100" height="80" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id="Event_0uzbald_di" bpmnElement="Event_0uzbald">\\n        <omgdc:Bounds x="802" y="122" width="36" height="36" />\\n        <bpmndi:BPMNLabel>\\n          <omgdc:Bounds x="809" y="165" width="22" height="14" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id="Activity_1gj4r8x_di" bpmnElement="Activity_1d8tyg9">\\n        <omgdc:Bounds x="600" y="100" width="100" height="80" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id="Event_0lgoel3_di" bpmnElement="Event_0lgoel3">\\n        <omgdc:Bounds x="642" y="232" width="36" height="36" />\\n        <bpmndi:BPMNLabel>\\n          <omgdc:Bounds x="649" y="275" width="22" height="14" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n    </bpmndi:BPMNPlane>\\n  </bpmndi:BPMNDiagram>\\n</definitions>\\n'
    this.processKey = this.$route.query.processKey
    this.processDefinitionId = this.$route.query.processDefinitionId
    this.tenantId = this.$route.query.tenantId
    if (this.processKey) {
      this.getProcessDefinitionXml(this.processKey, this.tenantId)
    } else if (this.processDefinitionId) {
      this.getVersionProcessDefinitionXml(this.processDefinitionId, this.tenantId)
    }
  },
  methods: {
    getProcessDefinitionXml (processKey, tenantId) {
      getProcessDefinitionXml(processKey, tenantId).then(response => {
        this.xml = response.data
      })
    },
    getVersionProcessDefinitionXml (processKey, tenantId) {
      getVersionProcessDefinitionXml(processKey, tenantId).then(response => {
        this.xml = response.data
      })
    },
    getModelDetail () {
      // Send request to get xml
      // this.xml = response.xml
    },
    save (data) {
      // data: { process: {...}, xml: '...', svg: '...' }
      const paramData = {
        xml: data.xml,
        tenantId: '1',
        id: data.process.id,
        category: data.process.category,
        name: data.process.name
      }
      deploy(paramData).then(response => {
      })
    }
  }
}
</script>
<style lang="less">
.designer {
  .flow-containers .djs-palette {
    left: 0px !important;
    top: 0px;
    border: 1px solid rgba(199, 197, 197, 0.32);
    width: 130px !important;
    margin: 10px 20px;
    border-radius: 10px !important;
  }

  .is-vertical .el-aside {
    background: rgba(250, 250, 250, 0.7) !important;
    margin-top: 5px;
    width: 18vw !important;
    border-radius: 10px !important;
    border: 0.5px solid #e8e8e8 !important;
  }

  .flow-containers {
    background-image: linear-gradient(90deg, rgba(60, 10, 30, .04) 3%, transparent 0), linear-gradient(1turn, rgba(60, 10, 30, .04) 3%, transparent 0);
    background-size: 20px 20px;
    background-position: 50%;
    background-repeat: repeat;
  }

  .is-vertical .el-header {
    background: rgb(253, 253, 253) !important;
  }
}
</style>
