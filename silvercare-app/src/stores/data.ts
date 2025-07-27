import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface HealthTip {
  id: number
  title: string
  content: string
  category: string
  date: string
  imageUrl?: string
}

export interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  capacity: number
  enrolled: number
  imageUrl?: string
}

export interface Rating {
  id: number
  userId: number
  rating: number
  comment: string
  date: string
}

export const useDataStore = defineStore('data', () => {
  // State
  const healthTips = ref<HealthTip[]>([
    {
      id: 1,
      title: '春季养生小贴士',
      content: '春季要注意保暖，多吃新鲜蔬菜水果，适量运动，保持心情愉快。',
      category: '营养健康',
      date: '2024-01-15',
      imageUrl: '/health-tip-1.jpg'
    },
    {
      id: 2,
      title: '老年人运动指南',
      content: '适合老年人的运动包括太极拳、散步、游泳等，每天坚持30分钟运动。',
      category: '运动健身',
      date: '2024-01-14',
      imageUrl: '/health-tip-2.jpg'
    },
    {
      id: 3,
      title: '预防高血压的饮食建议',
      content: '低盐低油饮食，多吃新鲜蔬菜，控制体重，定期检查血压。',
      category: '疾病预防',
      date: '2024-01-13',
      imageUrl: '/health-tip-3.jpg'
    }
  ])

  const events = ref<Event[]>([
    {
      id: 1,
      title: '太极拳班',
      description: '专为老年人设计的太极拳课程，有助于改善身体平衡和柔韧性',
      date: '2024-01-20',
      time: '09:00',
      location: '社区活动中心',
      category: '运动健身',
      capacity: 20,
      enrolled: 15
    },
    {
      id: 2,
      title: '健康讲座：心脏保健',
      description: '专业医师讲解心脏健康知识和预防措施',
      date: '2024-01-25',
      time: '14:00',
      location: '社区卫生服务中心',
      category: '健康讲座',
      capacity: 50,
      enrolled: 32
    },
    {
      id: 3,
      title: '老年人营养烹饪课',
      description: '学习制作适合老年人的营养美食',
      date: '2024-01-30',
      time: '10:00',
      location: '社区厨艺教室',
      category: '营养健康',
      capacity: 15,
      enrolled: 8
    }
  ])

  const ratings = ref<Rating[]>([
    {
      id: 1,
      userId: 2,
      rating: 5,
      comment: '这个软件非常好用，界面简洁易懂，很适合我们老年人使用！',
      date: '2024-01-15'
    },
    {
      id: 2,
      userId: 3,
      rating: 4,
      comment: '功能很丰富，健康资讯很有用，希望能增加更多活动。',
      date: '2024-01-14'
    },
    {
      id: 3,
      userId: 2,
      rating: 5,
      comment: '太极拳课程很棒，老师很耐心，我的身体感觉好多了。',
      date: '2024-01-13'
    }
  ])

  const enrolledEvents = ref<number[]>([])

  // Getters
  const averageRating = computed(() => {
    if (ratings.value.length === 0) return 0
    const total = ratings.value.reduce((sum, rating) => sum + rating.rating, 0)
    return (total / ratings.value.length).toFixed(1)
  })

  const totalRatings = computed(() => ratings.value.length)

  const recentHealthTips = computed(() => 
    healthTips.value
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
  )

  const upcomingEvents = computed(() => 
    events.value
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  )

  // Actions
  function addHealthTip(tip: Omit<HealthTip, 'id'>) {
    const newTip: HealthTip = {
      ...tip,
      id: Date.now()
    }
    healthTips.value.unshift(newTip)
    
    // Store in localStorage
    localStorage.setItem('silvercare_health_tips', JSON.stringify(healthTips.value))
  }

  function addEvent(event: Omit<Event, 'id'>) {
    const newEvent: Event = {
      ...event,
      id: Date.now()
    }
    events.value.push(newEvent)
    
    // Store in localStorage
    localStorage.setItem('silvercare_events', JSON.stringify(events.value))
  }

  function enrollInEvent(eventId: number, userId: number): boolean {
    const event = events.value.find(e => e.id === eventId)
    if (event && event.enrolled < event.capacity) {
      event.enrolled++
      enrolledEvents.value.push(eventId)
      
      // Store in localStorage
      localStorage.setItem('silvercare_events', JSON.stringify(events.value))
      localStorage.setItem('silvercare_enrolled_events', JSON.stringify(enrolledEvents.value))
      
      return true
    }
    return false
  }

  function addRating(rating: Omit<Rating, 'id'>) {
    const newRating: Rating = {
      ...rating,
      id: Date.now()
    }
    ratings.value.unshift(newRating)
    
    // Store in localStorage
    localStorage.setItem('silvercare_ratings', JSON.stringify(ratings.value))
  }

  function initializeData() {
    // Load data from localStorage if available
    const storedTips = localStorage.getItem('silvercare_health_tips')
    if (storedTips) {
      try {
        healthTips.value = JSON.parse(storedTips)
      } catch (error) {
        console.error('Error parsing stored health tips:', error)
      }
    }

    const storedEvents = localStorage.getItem('silvercare_events')
    if (storedEvents) {
      try {
        events.value = JSON.parse(storedEvents)
      } catch (error) {
        console.error('Error parsing stored events:', error)
      }
    }

    const storedRatings = localStorage.getItem('silvercare_ratings')
    if (storedRatings) {
      try {
        ratings.value = JSON.parse(storedRatings)
      } catch (error) {
        console.error('Error parsing stored ratings:', error)
      }
    }

    const storedEnrolled = localStorage.getItem('silvercare_enrolled_events')
    if (storedEnrolled) {
      try {
        enrolledEvents.value = JSON.parse(storedEnrolled)
      } catch (error) {
        console.error('Error parsing stored enrolled events:', error)
      }
    }
  }

  return {
    // State
    healthTips,
    events,
    ratings,
    enrolledEvents,
    // Getters
    averageRating,
    totalRatings,
    recentHealthTips,
    upcomingEvents,
    // Actions
    addHealthTip,
    addEvent,
    enrollInEvent,
    addRating,
    initializeData
  }
})