import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ClipLoader } from 'react-spinners'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import MyCourses from './pages/MyCourses'
import AllCourses from './pages/AllCourses'
import ViewCourse from './pages/ViewCourse'
import ViewLecture from './pages/ViewLecture'
import Dashboard from './pages/Educator/Dashboard'
import Courses from './pages/Educator/Courses'
import CreatorCourses from './pages/Educator/CreatorCourses'
import EditCourse from './pages/Educator/EditCourse'
import CreateLecture from './pages/Educator/CreateLecture'
import EditLecture from './pages/Educator/EditLecture'
import SearchCourses from './pages/SearchCourses'
import Footer from './component/Footer'
import Nav from './component/Nav'
import useGetCurrentUser from './customHooks/getCurrentUser'
function App() {
  useGetCurrentUser()
  const location = useLocation()
  const { userData, isLoading } = useSelector((state) => state.user)
  const hideNav = ['/signup', '/login', '/forgot-password'].includes(location.pathname)
  const educatorRoute = (page) => (
    userData?.role === 'educator' ? page : <Navigate to={userData ? '/' : '/signup'} replace />
  )

  if (isLoading) {
     return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <ClipLoader size={22} color="#2563eb" />
          <span className="text-sm font-bold text-slate-700">Loading your account...</span>
        </div>
      </main>
    )
  }

  return (
    <>
      {!hideNav && <Nav />} 
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to="/" replace />}/>
        <Route path='/login' element={!userData ? <Login/> : <Navigate to="/" replace />}/>
        <Route path='/forgot-password' element={!userData ? <ForgotPassword/> : <Navigate to="/" replace />}/>
        <Route path='/profile' element={userData ? <Profile/> : <Navigate to="/signup" replace />}/>
        <Route path='/edit-profile' element={userData ? <EditProfile/> : <Navigate to="/signup" replace />}/>
        <Route path='/my-courses' element={userData ? <MyCourses/> : <Navigate to="/signup" replace />}/>
        <Route path='/all-courses' element={<AllCourses/>}/>
        <Route path='/search-courses' element={<SearchCourses />} />
        <Route path='/search-with-ai' element={<Navigate to="/search-courses" replace />} />
        <Route path='/view-course/:courseId' element={<ViewCourse/>}/>
        <Route path='/view-lecture/:courseId/:lectureId' element={<ViewLecture />} />
        <Route path='/dashboard' element={educatorRoute(<Dashboard/>)} />
        <Route path='/courses' element={educatorRoute(<Courses/>)} />
        <Route path='/create-course' element={educatorRoute(<CreatorCourses/>)} />
        <Route path='/edit-course/:courseId' element={educatorRoute(<EditCourse/>)} />
        <Route path='/create-lecture/:courseId' element={educatorRoute(<CreateLecture/>)} />
        <Route path='/edit-lecture/:courseId/:lectureId' element={educatorRoute(<EditLecture/>)} />
      </Routes>
      {!hideNav && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App
