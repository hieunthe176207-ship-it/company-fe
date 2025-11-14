import React from "react";
import MainLayout from "../components/layout/MainLayout";
import { useRoutes } from "react-router-dom";
import Auth from "../pages/auth/Auth";
import Home from "../pages/home/Home";
import Setting from "../pages/setting/Setting";
import ListEmployee from "../pages/employee/listEmployee/ListEmployee";
import PrivateRouter from "./PrivateRouter";
import CheckForgotPasswordToken from "../pages/auth/forgotPassword/CheckForgotPasswordToken";
import ListCandidate from "../pages/candidate/ListCandidate";
import ListForm from "../pages/form/ListForm";
import SaveForm from "../pages/form/SaveForm";
import UpdateForm from "../pages/form/UpdateForm";
import FormDetail from "../pages/form/FormDetail";
import ChangeEmployeeProfile from "../pages/setting/ChangeEmployeeProfile";
import SubmitForm from "../pages/submitForm/SubmitForm";
import HisotorySubmit from "../pages/submitForm/HisotorySubmit";
import AllFormSubmit from "../pages/submitForm/AllFormSubmit";
import FormAnswer from "../pages/submitForm/FormAnswer";
import AddPost from "../pages/post/AddPost";
import ListAllPost from "../pages/post/ListAllPost";
import MyPost from "../pages/post/MyPost";
import UpdatePost from "../pages/post/UpdatePost";
import NotFound from "../pages/error/NotFound";
import NotPermisson from "../pages/error/NotPermisson";
import SendIdea from "../pages/idea/SendIdea";
import ViewIdea from "../pages/idea/ViewIdea";
import Schedule from "../pages/schedule/Schedule";
import ConfigChatBot from "../pages/chatbot/ConfigChatBot";
import History from "../pages/history/History";
import Security from "../pages/security/Security";
import HomeRouter from "./HomeRouter";
import CandidateRouter from "./CandidateRouter";
import Test from "../pages/test/Test";

const AllRouter = () => {
  const router = [
    {
      path: "/",
      element: (
        <PrivateRouter>
          <MainLayout></MainLayout>
        </PrivateRouter>
      ),
      children: [
        {
          path: "",
          element: <HomeRouter></HomeRouter>,
        },
        {
          path: "/report",
          element: <Home></Home>,
        },
        {
          path: "/settings",
          element: (
            <CandidateRouter>
              <Setting></Setting>
            </CandidateRouter>
          ),
        },
        {
          path: "/list-employee",
          element: <ListEmployee></ListEmployee>,
        },
        {
          path: "/list-candidate",
          element: <ListCandidate></ListCandidate>,
        },
        {
          path: "/update-employee/:id",
          element: <ChangeEmployeeProfile></ChangeEmployeeProfile>,
        },
        {
          path: "/add-form",
          element: <SaveForm></SaveForm>,
        },
        {
          path: "/list-form",
          element: <ListForm></ListForm>,
        },
        {
          path: "/update-form/:id",
          element: <UpdateForm></UpdateForm>,
        },
        {
          path: "/form-detail/:id",
          element: <FormDetail></FormDetail>,
        },
        {
          path: "/post",
          element: <ListAllPost></ListAllPost>,
        },
        {
          path: "/submit-form",
          element: <SubmitForm></SubmitForm>,
        },
        {
          path: "/history",
          element: <History></History>,
        },
        {
          path: "/history-submit",
          element: <HisotorySubmit></HisotorySubmit>,
        },
        {
          path: "/all-form",
          element: <AllFormSubmit></AllFormSubmit>,
        },
        {
          path: "/form-answer/:id",
          element: <FormAnswer></FormAnswer>,
        },
        {
          path: "/add-post",
          element: <AddPost></AddPost>,
        },
        {
          path: "/my-post",
          element: (
            <CandidateRouter>
              <MyPost></MyPost>
            </CandidateRouter>
          ),
        },
        {
          path: "/update-post/:id",
          element: <UpdatePost></UpdatePost>,
        },
        {
          path: "/idea",
          element: <SendIdea></SendIdea>,
        },
         {
          path: "/test",
          element: <Test></Test>,
        },
        {
          path: "/view-idea",
          element: <ViewIdea></ViewIdea>,
        },
        {
          path: "/schedule",
          element: <Schedule></Schedule>,
        },
        {
          path: "/chat-bot",
          element: <ConfigChatBot></ConfigChatBot>,
        },
        {
          path: "/security",
          element: <Security></Security>,
        },
      ],
    },
    {
      path: "/auth",
      element: <Auth></Auth>,
    },
    {
      path: "/check-forgot",
      element: <CheckForgotPasswordToken></CheckForgotPasswordToken>,
    },
    {
      path: "/fobiden",
      element: <NotPermisson></NotPermisson>,
    },

    {
      path: "*",
      element: <NotFound></NotFound>,
    },
  ];

  return useRoutes(router);
};

export default AllRouter;
