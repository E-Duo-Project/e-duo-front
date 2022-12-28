<template>
    <v-card
        class="mx-auto school-modal-container"
        max-width="400"
        style='border-radius:15px;'
    >
        <v-card-title  class="white--text darken-4" style="background-color: #62929e">
            <h4 class="text-center">과제 추가하기</h4>
        </v-card-title>
        <v-card-text class="pt-4">
            <v-row>
                <v-col>
                    <v-select
                        v-model="pickAssignment"
                        label="강의를 선택하세요"
                        :items="assignmentList"
                        item-text="name"
                        item-value="value"
                        outlined
                    ></v-select>
                    <v-btn
                        @click="submitAssignment"
                        color="#62929E"
                    >추가</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import {mapState, mapActions} from "vuex";
export default {
    props : {
        lectures : Array,
        setModalOn : Function,
        courseId : String,
    },
    watch:{
        userSchool :function(){
            console.log(this.userSchool)
        },
    },
    mounted() {
        const modalBack = document.querySelector('.modal-background');
        const modal = document.querySelector('.school-modal-container');
    
        modalBack.addEventListener('click' , (e) => {
            if(modal.contains(e.target) || e.target === modal){
                return;
            }else{
                this.setModalOn()
            }
        })

        this.assignmentList = [];
        this.lectures.forEach((lecture)=>{
            if(!lecture.existAssignment){
                this.assignmentList.push({name:lecture.lectureName, value:lecture.lectureId});
            }
        })
    },
    data() {
        return {
            pickAssignment:'',
            assignmentList:[],
        }
    },
    computed: {
        ...mapState("userStore", [ "userInfo" ]),
    },
    methods: {
        ...mapActions("attendanceStore", ["enterAssignment"]),
        async submitAssignment(){
            //backEnd   this.pickAssignment : lectureId
            await this.enterAssignment({lectureId:this.pickAssignment, userRole:this.userInfo.role, courseId:this.courseId});
            this.setModalOn();
        },
    },
}
</script>

<style>

</style>