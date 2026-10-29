import { useState } from 'react'
import { Luggage, Backpack, Plus } from 'lucide-react'
import './Home.css'
import Createtrip from './Createtrip.jsx'

function Home({
  trips = [],
  onCreateTrip,
  onOpenTrip,
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  return (
    <>
      {/* 藍色主視覺 */}
      <section className="home-hero">
        <h1>最近需要準備什麼行李？</h1>

        <div className="trip-types">
          <button>國內旅遊行李</button>
          <button>出國旅遊行李</button>
          <button>出差行李</button>
          <button>登山行李</button>
          <button>滑雪行李</button>
          <button>十其他</button>
        </div>
      </section>

      {/* 最近的行李 */}
      <section className="home-recent">
        <h2>最近的行李</h2>

        {trips.length === 0 ? (
          <div className="empty-state">
            <p>
              點選右下角「＋建立行李」按鈕，
              建立第一個專屬行李清單吧！
            </p>
          </div>
        ) : (
          <div className="trip-list">
            {trips.map((trip) => (
              <button className="trip-card"
                key={trip.id}
                onClick={() => onOpenTrip(trip)}>
                <div className="trip-preview">
                  <span>{trip.type}</span>

                  <div className="trip-bag-icons">
                    <Luggage size={20} />
                    <Backpack size={20} />
                  </div>
                </div>

                <div className="trip-info">
                  <span className="trip-name">{trip.name}</span>
                </div>

                <p className="trip-date">
                  {trip.startDate} - {trip.endDate}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 右下角建立按鈕 */}
      <button
        className="create-trip-button"
        onClick={() => setIsCreateOpen(true)}
        >
        <Plus size={24} />
        <span>建立行李</span>
      </button>

        {isCreateOpen && (
        <Createtrip
            onClose={() => setIsCreateOpen(false)}
            onComplete={(trip) => {
            onCreateTrip(trip)
            setIsCreateOpen(false)
            }}
        />
        )}
    </>
  )
}

export default Home