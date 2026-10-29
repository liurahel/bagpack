import { useEffect, useState } from 'react'
import {
  Menu,
  CircleUserRound,
  House,
  LayoutGrid,
  Luggage,
} from 'lucide-react'

import Home from './pages/Home.jsx'
import './App.css'
import Loading from './pages/Loading.jsx'
import Editor from './pages/Editor.jsx'

function App() {
  // 側邊欄是否展開
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [page, setPage] = useState('home')
  const [currentTrip, setCurrentTrip] = useState(null)

  // 示範等待 1.5 秒後，進入編輯頁
  useEffect(() => {
    if (page !== 'loading') return

    const timer = setTimeout(() => {
      setPage('editor')
    }, 1500)

    return () => clearTimeout(timer)
  }, [page])

  // 讀取之前存在瀏覽器裡的行李
  const [trips, setTrips] = useState(() => {
    try {
      const savedTrips = JSON.parse(
        localStorage.getItem('bagpack-trips') || '[]'
      )

      return Array.isArray(savedTrips) ? savedTrips : []
    } catch {
      return []
    }
  })

  // 完成表單後，新增一筆行李
  function createTrip(trip) {
    const updatedTrips = [trip, ...trips]

    // 目前保存行程資料，個人化資料不存入瀏覽器
    const savedTrips = updatedTrips.map((item) => ({
      ...item,
      personal: null,
    }))

    localStorage.setItem(
      'bagpack-trips',
      JSON.stringify(savedTrips)
    )

    setTrips(updatedTrips)
    setCurrentTrip(trip)
    setIsSidebarOpen(false)
    setPage('loading')
    window.scrollTo(0, 0)
  }
  function openTrip(trip) {
    setCurrentTrip(trip)
    setIsSidebarOpen(false)
    setPage('editor')
    window.scrollTo(0, 0)
  }
  function goHome() {
  setPage('home')
  setIsSidebarOpen(false)
  window.scrollTo(0, 0)
  }

  return (
    <>
      {/* 頂部導覽列 */}
      <header className="header">
        <div
          className={`header-left ${
            isSidebarOpen ? 'is-open' : ''
          }`}
        >
          <button
            className="icon-button"
            aria-label={
              isSidebarOpen ? '收合選單' : '展開選單'
            }
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar"
            onClick={() =>
              setIsSidebarOpen(!isSidebarOpen)
            }
          >
            <Menu size={24} />
          </button>

          <button className="logo" onClick={goHome}>
            BagPack.
          </button>
        </div>

        <button
          className="icon-button account-button"
          aria-label="會員帳號"
        >
          <CircleUserRound size={24} />
        </button>
      </header>

      {/* 左側選單 */}
      {(page === 'home' || isSidebarOpen) && (
        <aside
          id="sidebar"
          className={`sidebar ${
            isSidebarOpen ? 'is-open' : ''
          }`}
        >
          <nav
            className="sidebar-nav"
            aria-label="主要選單"
          >
            <button
              className={`nav-item ${page === 'home' ? 'active' : ''}`}
              aria-current={page === 'home' ? 'page' : undefined}
              onClick={() => setPage('home')}
            >
              <House size={24} />
              <span>首頁</span>
            </button>

            <button className="nav-item">
              <LayoutGrid size={24} />
              <span>探索範本</span>
            </button>

            <button className="nav-item">
              <Luggage size={24} />
              <span>我的行李</span>
            </button>
          </nav>

          {/* 展開時顯示行李列表 */}
          {isSidebarOpen && (
            <div className="sidebar-details">
              <p className="sidebar-heading">
                常用行李
              </p>

              <p className="sidebar-heading">
                所有行李
              </p>

              {trips.map((trip) => (
                <button
                  className="sidebar-trip"
                  key={trip.id}
                  onClick={() => openTrip(trip)}
                >
                  {trip.name}
                </button>
              ))}
            </div>
          )}
        </aside>
      )}

      {/* 首頁內容 */}
      <main
        className={
          page === 'home'
            ? `main-content ${isSidebarOpen ? 'is-shifted' : ''}`
            : 'workspace-content'
        }
      >
        {page === 'home' && (
          <Home
            trips={trips}
            onCreateTrip={createTrip}
            onOpenTrip={openTrip}
          />
        )}

        {page === 'loading' && <Loading />}

        {page === 'editor' && currentTrip && (
          <Editor
            key={currentTrip.id}
            trip={currentTrip}
          />
        )}
      </main>
    </>
  )
}

export default App