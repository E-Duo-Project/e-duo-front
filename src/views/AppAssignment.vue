<template>
    <div>
        <v-container style="max-width: 600px" fill-height>
            <v-layout align-center>
                <v-flex xs12>
                    <h2 style="text-align:center">{{courseName}} 과제관리</h2>
                    <v-row>
                        <v-col cols="12">
                            <p class="text-center">최신 강의 : {{todayLectureName}}&nbsp;&nbsp;<span  @click="moveToday()"><v-icon color="indigo">mdi-link-variant</v-icon>이동하기</span></p>
                        </v-col>
                    </v-row>
                    <v-card
                        v-for="(lecture, index) in lectures" :key="index"
                        class="mx-auto mb-4"
                        :id="[`index--${index}`]"
                        max-width="600"
                    >
                        <v-card-title>
                            {{lecture.lectureName}}
                        </v-card-title>

                        <v-card-subtitle>
                            <v-icon>mdi-calendar-clock</v-icon>{{lecture.lectureDate | yyyyMMdd}} {{lecture.startTime | hhmm}} ~ {{lecture.endTime | hhmm}}
                            <v-spacer></v-spacer>
                            강의 내용 : {{lecture.description}}
                        </v-card-subtitle>

                        <v-card-actions>
                            <v-btn
                                @click="showDetails(lecture)"
                                color="orange lighten-2"
                                text
                                :disabled="!lecture.existAssignment"
                            >
                            명단 확인하기
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                icon
                                @click="showDetails(lecture)"
                                :disabled="!lecture.existAssignment"
                            >
                            <v-icon>{{ lecture.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                            </v-btn>
                        </v-card-actions>
                        <v-expand-transition>
                            <div v-show="lecture.show">
                            <v-divider></v-divider>
                            <v-card-text>
                                <student-list :lectureId="lecture.lectureId" :show="lecture.show"></student-list>
                            </v-card-text>
                            </div>
                        </v-expand-transition>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <div class="add-assignment-button" role="button" @click="setModalOn">+</div>
        <div v-if="isModalOn" class='modal-background'>
            <add-assignment class='school-modal-container' :lectures="lectures" :setModalOn="setModalOn" :courseId="courseId"></add-assignment>
        </div>
    </div>
</template>
<script>
import StudentList from '@/components/attendance/StudentList.vue';
import AddAssignment from '@/components/attendance/AddAssignment';
import {mapState, mapActions} from "vuex";
export default {
    name:'AppAssignment',
    components: {
        StudentList,
        AddAssignment,
    },
    async mounted() {
        this.courseName = 'Network'
        this.courseId = 'Mdk1-tla-5as1';
        await this.getLecture(this.courseId, this.userInfo.role);

        for (let i = 0; i < this.lectures.length; i++) {
            var temp = 'index--' + i;
            var Elem = document.getElementById(temp).offsetTop;
            this.lecturesHeight.push(Elem);
        }
        // console.log(this.lecturesHeight);

        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth()+1;
        var day = today.getDate();
        var lecture_time = year + '-' + month + '-' + day + ' 00:00:00';
        var date1 = new Date(lecture_time);
        
        var index = 0;
        
        for(var i=0; i<this.lectures.length; i++){
            var date2 = new Date(this.lectures[i].lectureDate);
            if(date1 == date2){
                break;
            } else if(date1 < date2){
                index-=1;
                break;
            } else{
                index = this.lectures.length -2;
            }
            index ++;
        }
        this.today = index;
        console.log(this.lectures[index]);
        this.todayLectureName = this.lectures[index].lectureName;
        this.moveToday();
    },
    watch:{
        lectures: function(){
            //modal에서 과제 추가했을 시 확인
        }
        // lectures: {
        //     handler(val){
        //         console.log(val);
        //     },
        //     deep: true,
        // }
    },
    data() {
        return {
            isModalOn:false,
            today: '',
            todayLectureName:'',
            lecturesHeight:[],
            show: false,
            switch1: '출석',
            switch2: '결석',
            
            courseId: '',
            courseName: '',
            lectureId: '',

            // lectures:[{name: '1주차-1 : spring Boot', lectureId: '1', existAssignment: true, lectureDate:'2022-12-12 00:00:00'}, {name: '1주차-2 : spring Boot', lectureId: '2', existAssignment: true, lectureDate:'2022-12-20 00:00:00'}, {name: '2주차-1 : spring Boot', lectureId: '3', existAssignment: true, lectureDate:'2022-12-22 00:00:00'},{name: '3주차-1 : spring Boot', lectureId: '4', existAssignment: false, lectureDate:'2022-12-25 00:00:00'}, {name: '3주차-2 : spring Boot', lectureId: '5', existAssignment: false, lectureDate:'2022-12-26 00:00:00'}, {name: '4주차-1 : spring Boot', lectureId: '6', existAssignment: false, lectureDate:'2022-12-29 00:00:00'},{name: '5주차-1 : spring Boot', lectureId: '7', existAssignment: false, lectureDate:'2022-12-30 00:00:00'}, {name: '5주차-2 : spring Boot', lectureId: '8', existAssignment: false, lectureDate:'2022-12-30 00:00:00'}, {name: '6주차-1 : spring Boot', lectureId: '9', existAssignment: false, lectureDate:'2022-12-30 00:00:00'},{name: '7주차-1 : spring Boot', lectureId: '10', existAssignment: false, lectureDate:'2022-12-30 00:00:00'}],
            // students:[{studentName: '장정민', schoolName: '사피고등학교', id: 'jang@test.com', assignment:'1'}, {studentName: '이다운', schoolName: '강남고등학교', id: 'dawoon12312345678@test.com', assignment:'1'}, {studentName: '황준현', schoolName: '사피고등학교', id: 'Hwang@test.com', assignment:'0'}, {studentName: '이영차', schoolName: '사피고등학교', id: 'cha@test.com', assignment:'0'}, {studentName: '이호준', schoolName: '사피고등학교', id: 'ho@test.com', assignment:'0'}, {studentName: '서지상', schoolName: '사피고등학교', id: 'Seo@test.com', assignment:'1'}, {studentName: '정우진', schoolName: '사피고등학교', id: 'Woo@test.com', assignment:'1'}, {studentName: '박지현', schoolName: '사피고등학교', id: 'Park@test.com', assignment:'0'}, {studentName: '안태현', schoolName: '사피고등학교', id: 'Ahn@test.com', assignment:'1'},],
            students:[],
            books: ['History', 'Fiction', 'Philosophy'],
            codes: ['C#', 'JavaScript', 'PHP'],
            submitter: [],
        }
    },
    computed:{
        ...mapState("userStore", [ "userInfo" ]),
        ...mapState("attendanceStore", ["lectures"]),
    },
    methods: {
        ...mapActions("attendanceStore", ["getLecture"]),
        showDetails(item){
            item.show = !item.show;
            this.$forceUpdate();
        },
        setModalOn(){
            this.isModalOn = !this.isModalOn;
        },
        moveToday(){
            window.scrollTo({top:this.lecturesHeight[this.today], behavior:'smooth'})
        }
    },
    filters: {
        yyyyMMdd: function(value){
            if(value == '') return '';

            var js_date = new Date(value);
            
            var year = js_date.getFullYear();
            var month = js_date.getMonth() + 1;
            var day = js_date.getDate();

            if(month < 10){
                month = '0' + month;
            }

            if(day < 10){
                day = '0' + day;
            }

            return year + '년 ' + month + '월 ' + day + '일';
        },
        hhmm: function(value){
            if(value == '') return '';

            return value.substr(0, 5);
        }
    }
}
</script>

<style>
.add-assignment-button{
    user-select: none;
    transition: opacity 700ms ease 0s;
    color: 700ms ease 0s;
    cursor: pointer;
    position: fixed;
    align-items: center;
    display: flex;
    justify-content: center;
    background: white;
    bottom: 26px;
    right: 26px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 2px 4px;
    transform: translateX(0px) translateZ(0px);
    z-index: 100;
    /* position: sticky;
    top: 0;
    padding: 1rem; */
}   

.add-assignment-button:hover{
    background: rgb(239, 239, 238);
}

::-webkit-scrollbar {
    width: 15px;
}

::-webkit-scrollbar-track {
    background: #e6e6e6;
    border-left: 1px solid #dadada;
}

::-webkit-scrollbar-thumb {
    background: #b0b0b0;
    border: solid 3px #e6e6e6;
    border-radius: 7px;
}

::-webkit-scrollbar-thumb:hover {
    background: black;
}

.v-list-item__content{
    padding: 0;
}

.v-input--selection-controls {
    margin-top: 0;
    padding-top: 0;
} 

.v-input__slot {
    margin-bottom: 0;
}
.v-messages {
    display: none;
}

.sticky {
    position: sticky;
    top: 0;
    background-color: lightcoral;
    padding: 1rem;
}

span:hover{
    background-color: rgb(239, 239, 238);
}

</style>