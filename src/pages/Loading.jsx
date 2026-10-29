import './Loading.css'

function Loading() {
  return (
    <div className="loading-screen" role="status">
      <p>
        正在生成合適的行李清單中
        <span className="loading-dots">...</span>
      </p>
    </div>
  )
}

export default Loading