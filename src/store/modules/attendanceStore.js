import { listAttendances } from "@/api/attendance";

const attendanceStore = {
    namespaced: true,
    state: {
        lectures: [],
        attendances: [],
    },
    getters: {
        ATTENDANCESGETTER(state) { 
            return state.attendances;
        }
    },
    mutations: {
        SET_LECTURE: (state, lectures) => {
            state.lectures.push(lectures);
        },
        SET_ATTENDANCE: (state, attendances) => {
            state.attendances.push(attendances);
        },
        CLEAR_LECTURE: (state) => { 
            state.lectures = [];
        },
        CLEAR_ATTENDANCE: (state) => { 
            state.attendances = [];
        }
    },
    actions: {
        // 전체 강의 조회
        async getLecture({ commit }, courseId, userRole) {
            const api = listAttendances();
            const response = await api.get(`/api/lecture/${courseId}?role=${userRole}`)
            .catch((error) => {
                console.log(error);
            });
            console.log(commit);
            console.log(response);
            await commit("CLEAR_LECTURE");
            response.data.forEach((lecture) => { 
                let lectures = {};
                lectures.lectureName = lecture.lectureName;
                lectures.lectureId = lecture.lectureId;
                lectures.lectureDate = lecture.lectureDate;
                lectures.startTime = lecture.startTime;
                lectures.endTime = lecture.endTime;
                lectures.description = lecture.description;
                lectures.existAssignment = lecture.existAssignment;
                commit("SET_LECTURE", lectures);
            })
        },
        
        // 출결/과제/점수 조회(한 강의를 듣는 전체 학생의 정보 조회)
        async getAttendance({ commit }, lectureId, userRole) {
            const api = listAttendances();
            const response = await api.get(`/api/attendance/${lectureId}`, {
                params: {
                    role: userRole,
                }
            })
            .catch((error) => {
                console.log(error);
            });
            await commit('CLEAR_ATTENDANCE');
            response.data.forEach((attendance) => { 
                let attendances = {};
                attendances.attendanceId = attendance.attendanceId;
                attendances.lectureId = attendance.lectureId;
                attendances.studentId = attendance.studentId;
                attendances.schoolName = attendance.schoolName;
                attendances.checkIn = attendance.checkIn;
                attendances.studentName = attendance.studentName;
                attendances.assignment = attendance.assignment;
                attendances.doneDate = attendance.doneDate;
                attendances.testScore = attendance.testScore;
                // attendances.phone = attendance.phone;
                // attendances.parentPhone = attendance.parentPhone;
                // attendances.parent = attendance.parent;
                commit("SET_ATTENDANCE", attendances);
            })
        },
        // 과제 입력(강사가 강의에 대한 과제를 부여할 경우)
        async enterAssignment({ commit, dispatch }, { lectureId, userRole, courseId }) { 
            console.log(courseId);
            const api = listAttendances();
            await api.put(`/api/assignment/register?role=${userRole}`, {
                lectureId: lectureId,
            })
            .catch((error) => {
                console.log(error);
            });
            console.log("수정완료", commit);
            await dispatch('getLecture', courseId, userRole);
        }
    }
}

export default attendanceStore;