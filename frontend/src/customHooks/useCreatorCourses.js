import { useEffect, useState } from 'react'
import axios from 'axios'

const useCreatorCourses = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCourses = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await axios.get('/api/course/getcreator', {
        withCredentials: true,
      })

      setCourses(Array.isArray(result.data) ? result.data : [])
    } catch (requestError) {
      setCourses([])
      setError(requestError.response?.data?.message || 'Failed to load courses.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return {
    courses,
    isLoading,
    error,
    refetch: fetchCourses,
  }
}

export default useCreatorCourses
