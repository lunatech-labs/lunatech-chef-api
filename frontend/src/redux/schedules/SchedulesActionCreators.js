import * as ActionTypes from "./SchedulesActionTypes";
import { axiosInstance } from "../Axios";
import { fetchAttendanceUser } from "../attendance/AttendanceActionCreators";

export const fetchSchedules = (fromDate) => (dispatch) => {
  dispatch(schedulesLoading(true));

  axiosInstance
    .get("/schedulesWithMenusInfo?fromdate=" + fromDate)
    .then(function (response) {
      dispatch(showAllSchedules(response, fromDate));
    })
    .catch(function (error) {
      console.log("Failed loading Schedules: " + error);
      dispatch(schedulesLoadingFailed(error.message));
    });
};

export const fetchSchedulesWithFilter = (fromDate, location) => (dispatch) => {
  dispatch(schedulesLoading(true));

  var filter =
    location === ""
      ? "?fromdate=" + fromDate
      : "?fromdate=" + fromDate + "&location=" + location;

  axiosInstance
    .get("/schedulesWithMenusInfo" + filter)
    .then(function (response) {
      dispatch(showAllSchedules(response, fromDate));
    })
    .catch(function (error) {
      console.log("Failed loading Schedules: " + error);
      dispatch(schedulesLoadingFailed(error.message));
    });
};

export const fetchSchedulesAttendance = () => (dispatch) => {
  dispatch(schedulesAttendanceLoading(true));

  axiosInstance
    .get("/schedulesWithAttendanceInfo")
    .then(function (response) {
      dispatch(showAllSchedulesAttendance(response));
    })
    .catch(function (error) {
      console.log("Failed loading Schedules: " + error);
      dispatch(schedulesLoadingAttendanceFailed(error.message));
    });
};

export const addNewSchedule =
  (newSchedule, userUuid, fromDate) => (dispatch) => {
    console.log("addNewSchedule fromDate " + fromDate);

    const scheduleToAdd = {
      menuUuid: newSchedule.menuUuid,
      locationUuid: newSchedule.locationUuid,
      date: newSchedule.date,
    };

    axiosInstance
      .post("/schedules", scheduleToAdd)
      .then((response) => {
        dispatch(fetchSchedules(fromDate));
        dispatch(fetchSchedulesAttendance());
        dispatch(fetchAttendanceUser(userUuid));
      })
      .catch(function (error) {
        console.log("Failed adding Schedule: " + error);
        dispatch(scheduleAddingFailed(error.message));
      });
  };

export const editSchedule = (editedSchedule, fromDate) => (dispatch) => {
  const sheduleToEdit = {
    menuUuid: editedSchedule.menuUuid,
    locationUuid: editedSchedule.locationUuid,
    date: editedSchedule.date,
  };

  axiosInstance
    .put("/schedules/" + editedSchedule.uuid, sheduleToEdit)
    .then((response) => {
      dispatch(fetchSchedules(fromDate));
    })
    .catch(function (error) {
      console.log("Failed editing Schedule: " + error);
      dispatch(scheduleEditingFailed(error.message));
    });
};

export const deleteSchedule = (scheduleUuid, fromDate) => (dispatch) => {
  axiosInstance
    .delete("/schedules/" + scheduleUuid)
    .then((response) => {
      dispatch(fetchSchedules(fromDate));
    })
    .catch(function (error) {
      console.log("Failed removing Schedule: " + error);
      dispatch(scheduleDeletingFailed(error.message));
    });
};

export const schedulesLoading = () => ({
  type: ActionTypes.SCHEDULES_LOADING,
});

export const schedulesAttendanceLoading = () => ({
  type: ActionTypes.SCHEDULES_ATTENDANCE_LOADING,
});

export const showAllSchedules = (schedules, fromDate) => ({
  type: ActionTypes.SHOW_ALL_SCHEDULES,
  payload: schedules.data,
  fromDate: fromDate,
});

export const showAllSchedulesAttendance = (schedulesAttendance) => ({
  type: ActionTypes.SHOW_ALL_SCHEDULES_ATTENDANCE,
  payload: schedulesAttendance.data,
});

export const schedulesLoadingFailed = (errmess) => ({
  type: ActionTypes.SCHEDULES_LOADING_FAILED,
  payload: errmess,
});

export const schedulesLoadingAttendanceFailed = (errmess) => ({
  type: ActionTypes.SCHEDULES_ATTENDANCE_LOADING_FAILED,
  payload: errmess,
});

export const scheduleAddingFailed = (errmess) => ({
  type: ActionTypes.ADD_NEW_SCHEDULE_FAILED,
  payload: errmess,
});

export const scheduleEditingFailed = (errmess) => ({
  type: ActionTypes.EDIT_SCHEDULE_FAILED,
  payload: errmess,
});

export const scheduleDeletingFailed = (errmess) => ({
  type: ActionTypes.DELETE_SCHEDULE_FAILED,
  payload: errmess,
});
