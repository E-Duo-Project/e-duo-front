<template>
    <v-form ref="form" @submit.prevent="signUp">
        <v-container>
            <!-- <v-icon>mdi-account-remove</v-icon> 미제출 인원수 :  명 -->
            <v-spacer></v-spacer>
            <v-virtual-scroll
                :items="studentsCopy"
                :item-height="80"
                height="300"
                width="auto"
            > 
                <template v-slot="{ item }">
                <v-list-item @click="handleClick(item)">
                    <v-list-item-content>
                        <v-list-item-title>{{item.studentName}}</v-list-item-title>
                        <v-list-item-subtitle>{{item.schoolName}}</v-list-item-subtitle>
                        <v-list-item-subtitle class="moveShowing">{{item.studentId}}</v-list-item-subtitle>
                    </v-list-item-content>
                    
                    <v-list-item-action>
                        <v-switch
                            v-model="submitter"
                            color="primary"
                            :label= "item.assignment==1?'제출함':'미제출'"
                            :value="item"
                            @click="submitEvent(item)"
                            dense
                        ></v-switch>
                    </v-list-item-action>
                </v-list-item>
                </template>
            </v-virtual-scroll>
            <div class="text-center">
                <v-btn
                    class="ma-1"
                    outlined
                    color="indigo"
                    plain
                    @click="anyAssignment"
                >전원 미제출</v-btn>
                <v-btn
                    class="ma-1"
                    outlined
                    color="indigo"
                    plain
                    @click="allAssignment"
                >전원 제출</v-btn>
                <v-btn 
                    :loading="loading"
                    class="ma-1"
                    outlined
                    color="indigo" 
                    @click="saveAssignment"
                >저장하기</v-btn>
            </div>
        </v-container>
    </v-form>
</template>

<script>
import {mapState, mapActions} from "vuex";
export default {
    props: {
        lectureId: String,
        show: Boolean
    },
    watch: {
        studentsCopy: function(){
            console.log(this.studentsCopy);
        },
        show: async function(){
            if(this.show){
                await this.getAttendance(this.lectureId, this.userInfo.role);
                
                this.studentsCopy = [];
                this.attendances.forEach((attendance)=>{
                    if(attendance.lectureId == this.lectureId){
                        this.studentsCopy.push(Object.assign({}, attendance));
                    }
                    if(attendance.assignment==1){
                        this.submitter.push(Object.assign({}, attendance));
                    }
                })
            }
        }
    },
    computed: {
        ...mapState("attendanceStore", ["attendances"]),
        ...mapState("userStore", [ "userInfo" ]),
    },
    data() {
        return {
            dataFetch: false,
            // attendances:[
            //     {
            //         attendanceId:"1",
            //         lectureId: "1",
            //         studentId:"ssafy1",
            //         studentName:"이다운",
            //         checkIn:"0",
            //         schoolName:"싸피고등학교",
            //         assignment:"1",
            //         doneDate:"2022-12-12",
            //         testScore: "89",
            //         phone: "01022222222",
            //         parentPhone: "01012341234",
            //         parent: "모",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "1",
            //         studentId:"ssafy2",
            //         studentName:"이호준",
            //         checkIn:"0",
            //         schoolName:"싸피중학교",
            //         assignment:"0",
            //         doneDate:"",
            //         testScore: "91",
            //         phone: "01050423969",
            //         parentPhone: "01012341234",
            //         parent: "부",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "1",
            //         studentId:"ssafy3",
            //         studentName:"이영차",
            //         checkIn:"0",
            //         schoolName:"싸피고등학교",
            //         assignment:"1",
            //         doneDate:"2022-12-12",
            //         testScore: "89",
            //         phone: "01022222222",
            //         parentPhone: "01012341234",
            //         parent: "모",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "1",
            //         studentId:"ssafy4",
            //         studentName:"황준현",
            //         checkIn:"0",
            //         schoolName:"싸피중학교",
            //         assignment:"0",
            //         doneDate:"",
            //         testScore: "91",
            //         phone: "01050423969",
            //         parentPhone: "01012341234",
            //         parent: "부",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "1",
            //         studentId:"ssafy5",
            //         studentName:"장정민",
            //         checkIn:"0",
            //         schoolName:"싸피고등학교",
            //         assignment:"1",
            //         doneDate:"2022-12-12",
            //         testScore: "89",
            //         phone: "01022222222",
            //         parentPhone: "01012341234",
            //         parent: "모",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "1",
            //         studentId:"ssafy6",
            //         studentName:"안태현",
            //         checkIn:"0",
            //         schoolName:"싸피중학교",
            //         assignment:"0",
            //         doneDate:"",
            //         testScore: "91",
            //         phone: "01050423969",
            //         parentPhone: "01012341234",
            //         parent: "부",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "1",
            //         studentId:"ssafy7",
            //         studentName:"박지현",
            //         checkIn:"0",
            //         schoolName:"싸피중학교",
            //         assignment:"0",
            //         doneDate:"",
            //         testScore: "91",
            //         phone: "01050423969",
            //         parentPhone: "01012341234",
            //         parent: "부",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "1",
            //         studentId:"ssafy8",
            //         studentName:"정우진",
            //         checkIn:"0",
            //         schoolName:"싸피중학교",
            //         assignment:"0",
            //         doneDate:"",
            //         testScore: "91",
            //         phone: "01050423969",
            //         parentPhone: "01012341234",
            //         parent: "부",
            //     },




            //     {
            //         attendanceId:"1",
            //         lectureId: "2",
            //         studentId:"ssafy1",
            //         studentName:"이다운",
            //         checkIn:"0",
            //         schoolName:"싸피고등학교",
            //         assignment:"1",
            //         doneDate:"2022-12-12",
            //         testScore: "89",
            //         phone: "01022222222",
            //         parentPhone: "01012341234",
            //         parent: "모",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "2",
            //         studentId:"ssafy2",
            //         studentName:"이호준",
            //         checkIn:"0",
            //         schoolName:"싸피중학교",
            //         assignment:"0",
            //         doneDate:"",
            //         testScore: "91",
            //         phone: "01050423969",
            //         parentPhone: "01012341234",
            //         parent: "부",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "2",
            //         studentId:"ssafy3",
            //         studentName:"이영차",
            //         checkIn:"0",
            //         schoolName:"싸피고등학교",
            //         assignment:"1",
            //         doneDate:"2022-12-12",
            //         testScore: "89",
            //         phone: "01022222222",
            //         parentPhone: "01012341234",
            //         parent: "모",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "2",
            //         studentId:"ssafy4",
            //         studentName:"황준현",
            //         checkIn:"0",
            //         schoolName:"싸피중학교",
            //         assignment:"0",
            //         doneDate:"",
            //         testScore: "91",
            //         phone: "01050423969",
            //         parentPhone: "01012341234",
            //         parent: "부",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "2",
            //         studentId:"ssafy5",
            //         studentName:"장정민",
            //         checkIn:"0",
            //         schoolName:"싸피고등학교",
            //         assignment:"1",
            //         doneDate:"2022-12-12",
            //         testScore: "89",
            //         phone: "01022222222",
            //         parentPhone: "01012341234",
            //         parent: "모",
            //     },
            //     {
            //         attendanceId:"1",
            //         lectureId: "2",
            //         studentId:"ssafy6",
            //         studentName:"안태현",
            //         checkIn:"0",
            //         schoolName:"싸피중학교",
            //         assignment:"0",
            //         doneDate:"",
            //         testScore: "91",
            //         phone: "01050423969",
            //         parentPhone: "01012341234",
            //         parent: "부",
            //     },
            // ],
            students:[],
            studentsCopy:[],
            submitter:[],
            switch1: '제출',
            switch2: '미제출',
            loading: false,
        }
    },
    methods: {
        ...mapActions("attendanceStore", ["getAttendance"]),
        handleClick(item){
            console.log(item);
        },
        anyAssignment(){
            this.studentsCopy.forEach((item)=>{
                item.assignment = 0;
            })
            this.submitter = [];
        },
        allAssignment(){
            this.studentsCopy.forEach((item)=>{
                item.assignment = 1;
            })
            this.submitter = this.studentsCopy;
        },
        submitEvent(item){
            if(item.assignment==1){
                item.assignment = 0;
            }else{
                item.assignment = 1;
            }
        },
        async saveAssignment(){
            this.loading = true;
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.loading = false;
        }
    },
}
</script>

<style>
    .v-input--selection-controls__ripple{
        display: none;
    }
    
    .moveShowing:hover {
        overflow: visible;
        white-space: normal;
        height: auto;
    }
</style>