import Sidebar from './Sidebar'

function MainLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />

      <main
        className="flex-grow-1 p-4"
        style={{
          minHeight: '100vh',
          backgroundColor: '#f4f7fb',
        }}
      >
        {children}
      </main>
    </div>
  )
}

export default MainLayout