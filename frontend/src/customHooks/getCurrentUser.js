import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData, setUserLoading } from '../redux/userSlice'

const useGetCurrentUser = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setUserLoading(true))

      try {
        const result = await axios.get('/api/user/getcurrentuser', {
          withCredentials: true,
        })

        dispatch(setUserData(result.data))
      } catch {
        dispatch(setUserData(null))
      }
    }

    fetchUser()
  }, [dispatch])
}

export default useGetCurrentUser
